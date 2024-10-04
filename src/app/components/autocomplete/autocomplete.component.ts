import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

import {
  MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { isObject, random, trim } from 'lodash-es';

import { FsAutocompleteHintDirective } from '../../directives/autocomplete-hint/autocomplete-hint.directive';
import { FsAutocompletePrefixDirective } from '../../directives/autocomplete-prefix/autocomplete-prefix.directive';
import { FsAutocompleteStaticDirective } from '../../directives/autocomplete-static/autocomplete-static.directive';
import { FsAutocompleteSuffixDirective } from '../../directives/autocomplete-suffix/autocomplete-suffix.directive';
import { FsAutocompleteTemplateDirective } from '../../directives/autocomplete-template/autocomplete-template.directive';
import { FsAutocompleteNoResultsDirective } from '../../directives/no-results-template/no-results-template.directive';


@Component({
  selector: 'fs-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsAutocompleteComponent),
      multi: true,
    },
  ],
})
export class FsAutocompleteComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  @ViewChild(MatAutocompleteTrigger, { static: true })
  public autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @ContentChild(FsAutocompleteTemplateDirective, { read: TemplateRef, static: true })
  public template: TemplateRef<FsAutocompleteTemplateDirective>;

  @ContentChildren(FsAutocompleteStaticDirective)
  public staticDirectives: QueryList<FsAutocompleteStaticDirective>;

  @ContentChild(FsAutocompleteNoResultsDirective)
  public noResultsDirective: FsAutocompleteNoResultsDirective;

  @ContentChild(FsAutocompleteSuffixDirective, { read: TemplateRef, static: true })
  public suffix: TemplateRef<any> = null;

  @ContentChild(FsAutocompletePrefixDirective, { read: TemplateRef, static: true })
  public prefix: TemplateRef<any> = null;

  @ContentChild(FsAutocompleteHintDirective, { read: TemplateRef, static: true })
  public hintTemplate: TemplateRef<any> = null;

  @HostBinding('class.fs-form-wrapper')
  public formWrapper = true;

  @ViewChild('keywordInput', { static: true, read: ElementRef })
  public keywordInput: ElementRef;

  @ViewChild('keywordNgModel', { static: true })
  public keywordNgModel: NgModel;

  @Input() public fetch: (keyword: string) => Observable<any>;
  @Input() public displayWith: (object: any) => string;
  @Input() public placeholder = '';
  @Input() public fetchOnFocus = false;
  @Input() public readonly = false;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public formFieldClass;
  @Input() public appearance: 'outline' | 'fill';
  @Input() public hint: string = null;
  @Input() public panelWidth: string | number = null;

  @Input('panelClass')
  public set setPanelClass(value) {
    this.panelClasses.push(value);
  }

  @Input() public set showClear(value: boolean) {
    this._showClear = value;
    this._cdRef.detectChanges();
  }

  public get showClear(): boolean {
    return this._showClear;
  }

  @Output() public cleared = new EventEmitter();
  @Output() public opened = new EventEmitter<void>();
  @Output() public closed = new EventEmitter<void>();

  public data: any[] = [];
  public keyword = '';
  public panelClasses = ['fs-autocomplete-panel'];
  public noResults = false;
  public name = 'autocomplete_'.concat(random(1, 9999999));
  public model = null;
  public searching = false;

  private _showClear: boolean;
  private _destroy$ = new Subject();
  private _keyword$ = new Subject();
  private _staticSelected$ = new BehaviorSubject<boolean>(false);
  private _ignoreKeys = [
    'Enter', 'Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight',
    'ArrowDown', 'Alt', 'Control', 'Shift',
  ];

  private _focus: () => void;
  private _onTouched: () => void;
  private _onChange: (value: any) => void;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _elRef: ElementRef,
  ) { }

  public registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  public ngOnInit() {
    // Because the input display is set natively the delay
    // ensure its set after this.keyword
    setTimeout(() => {
      this._updateKeywordDisplay();
    });

    this._keyword$
      .pipe(
        tap(() => {
          this.searching = true;
          this.panelClasses = [
            ...this.panelClasses,
            'searching',
          ];

          if(this.noResultsDirective) {
            this.noResultsDirective.isShow = this.noResultsDirective.show(this._getKeyword());
          }

          this.staticDirectives.forEach((staticDirective) => {
            staticDirective.isShow = staticDirective.show(this._getKeyword());
            staticDirective.isDisabled = staticDirective.disable(this._getKeyword());
          });
          this._cdRef.markForCheck();
        }),
        debounceTime(200),
        filter((event: KeyboardEvent) => {
          return !event || this._ignoreKeys.indexOf(event.key) === -1;
        }),
        switchMap((event: any) => {
          return this.fetch(trim(event.target.value))
            .pipe(
              tap((response: any) => {
                this.data = response;
                this.noResults = !response.length;
                this._cdRef.markForCheck();
                this.autocompleteTrigger.openPanel();
                this.searching = false;
                this.panelClasses = this.panelClasses
                  .filter((name) => name !== 'searching');
              }),
              takeUntil(this._destroy$),
            );
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._onTouched();
      });

    this.opened
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        //Hack: disable the focus event when the panel is opened to avoid
        //optionSelected() calling input.focus() too early
        this._focus = this.keywordInput.nativeElement.focus;
        this.keywordInput.nativeElement.focus = () => {
          //dummy
        };

        setTimeout(() => {
          const width = this._elRef.nativeElement.getBoundingClientRect().width;
          const panel = this.autocomplete.panel?.nativeElement;
          if (panel) {
            panel.style.minWidth = `${width}px`;
          }
        }, 200);
      });

    this.closed
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((event) => {
        if(this._staticSelected$.getValue()) {
          this.keywordInput.nativeElement.blur();
          this._staticSelected$.next(false);
        }

        setTimeout(() => {
          this.keywordInput.nativeElement.focus = this._focus;
        });
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && this.showClear === undefined) {
      this.showClear = this.disabled
        ? false
        : true;
    }
  }

  public load() {
    this.searching = true;
    this._keyword$.next({ target: { value: this._getKeyword() } });
  }

  public focus() {
    this.keywordInput.nativeElement.focus();
  }

  public inputFocus() {
    if (this.readonly || this.disabled) {
      return;
    }

    if (this.fetchOnFocus) {
      if (!this.model) {
        this.load();
      }
    }
  }

  public inputBlur() {
    if (this.readonly || this.disabled) {
      return;
    }

    setTimeout(() => {
      if (!this.model) {
        this.clearKeyword();
      }

      this._updateKeywordDisplay();
      this.clearResults();
      this.close();
    }, 200);
  }

  public display = (data) => {
    if (data && this.displayWith) {
      return this.displayWith(data);
    }

    return '';
  };

  public select(value) {
    if (this._isStaticSelected(value)) {
      this.staticSelect(value.staticOptionIndex);
    } else {
      this.model = value;
      this.data = [];
      this._updateKeywordDisplay();
      this._onChange(value);
    }

    this.clearResults();
    this.close();
  }

  public optionSelected(event: MatAutocompleteSelectedEvent) {
    this.select(event.option.value);
    this.close();
  }

  public close() {
    this.autocompleteTrigger.closePanel();
  }

  public writeValue(value: any): void {
    this.model = value;
    this._updateKeywordDisplay();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public input(event) {
    if (this.readonly || this.disabled) {
      return;
    }

    if (!event.target.value.length) {
      return this.clear();
    }

    this._keyword$.next(event);
  }

  public keyDown(event: KeyboardEvent) {
    if (this.readonly || this.disabled) {
      return;
    }

    if (event.code === 'Tab') {
      if (this.autocompleteTrigger.activeOption) {
        this.select(this.autocompleteTrigger.activeOption.value);
      }
    } else if (event.code === 'Backspace') {
      if (this.model) {
        this.clearModel();
        this.clearKeyword();
      }

    } else if (!this._isWindows() && !this._isMacOS()) {
      if (this._ignoreKeys.indexOf(event.key) === -1) {
        this.searching = true;
        this.data = [];
        if (this.model) {
          this.clear();
        }
      }
    }
  }

  public keyUp(event: any) {
    if (this.readonly || this.disabled) {
      return;
    }

    if (event.code === 'Backspace' && !event.target.value.length) {
      this.load();
    }
  }

  public staticSelect(index) {
    const keyword = (this.keyword as any).keyword;
    if (!this.model) {
      this.keywordNgModel.reset();
    }

    this._staticSelected$.next(true);
    const staticDirective: FsAutocompleteStaticDirective = this.staticDirectives.toArray()[index];
    staticDirective.selected.emit(keyword);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clearResults() {
    this.data = [];
    this.noResults = false;
  }

  public clear(closePanel = true) {
    this.clearResults();

    if(closePanel) {
      this.close();
    }

    this.clearModel();
    this.clearKeyword();
  }

  public clearModel() {
    this.model = null;
    this._onChange(null);
  }

  public clearKeyword() {
    this.keyword = null;
    this._updateKeywordDisplay();
  }

  public clearClick(event: MouseEvent) {
    event.stopPropagation();
    this.clearModel();
    this.keywordInput.nativeElement.value = null;
    this.cleared.emit();
    this.keywordInput.nativeElement.focus();
    this.load();
  }

  private _updateKeywordDisplay() {
    const value = this.model ? this.display(this.model) : '';
    this.keyword = this.model;
    this.keywordInput.nativeElement.value = value;
    this._cdRef.markForCheck();
  }

  private _getKeyword() {
    return this.keywordInput.nativeElement.value;
  }

  private _isMacOS(): boolean {
    return navigator.platform.indexOf('Mac') > -1;
  }

  private _isWindows(): boolean {
    return navigator.platform.indexOf('Win') > -1;
  }

  private _isStaticSelected(value): boolean {
    return isObject(value) && value.staticOptionIndex !== undefined;
  }
}
