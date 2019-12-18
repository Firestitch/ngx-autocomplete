import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trim, random } from 'lodash-es';

import { FsAutocompleteTemplateDirective } from '../../directives/autocomplete-template/autocomplete-template.directive';
import { FsAutocompleteSuffixDirective } from '../../directives/autocomplete-suffix/autocomplete-suffix.directive';
import { FsAutocompleteStaticTemplateDirective } from '../../directives/static-template/static-template.directive';


@Component({
  selector: 'fs-autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: [ 'autocomplete.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsAutocompleteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild(MatAutocompleteTrigger, { static: true }) autocomplete: MatAutocompleteTrigger;

  @ContentChild(FsAutocompleteTemplateDirective, { read: TemplateRef, static: true })
  public template: TemplateRef<FsAutocompleteTemplateDirective> = null;

  @ContentChildren(FsAutocompleteStaticTemplateDirective, { read: TemplateRef })
  set t(val) {
    this.staticTemplates = val;
  }
  public staticTemplates: TemplateRef<FsAutocompleteStaticTemplateDirective>[] = null;

  @ContentChild(FsAutocompleteSuffixDirective, { read: TemplateRef, static: true })
  public suffix: TemplateRef<FsAutocompleteSuffixDirective> = null;

  @HostBinding('class.fs-form-wrapper') formWrapper = true;

  @ViewChild('keywordInput', { static: true }) keywordInput: ElementRef;

  @Input() public fetch: Function = null;
  @Input() public placeholder = '';
  @Input() public displayWith: Function = null;
  @Input() public fetchOnFocus = false;
  @Input() public readonly = false;
  @Input() public disabled = false;
  @Input() public ngModel;

  @Input('panelClass') set setPanelClass(value) {
    this.panelClasses.push(value);
  }

  public searchData: any[] = [];
  public keyword = '';
  public panelClasses = ['fs-autocomplete-panel'];
  public keyword$ = new Subject();
  public noResults = false;
  public name = 'autocomplete_'.concat(random(1, 9999999));

  protected _destroy$ = new Subject();
  protected _model = null;

  private _ignoreKeys = ['Enter', 'Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight',
                          'ArrowDown', 'Alt', 'Control', 'Shift', 'Tab']
  private _onTouched = () => { };
  private _onChange = (value: any) => {};

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) { }

  public search(e, keyword) {

    if (e) {
      if (this._ignoreKeys.indexOf(e.key) >= 0) {
        return;
      }
    }

    if (this.fetch) {
      this.fetch(trim(keyword))
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(response => {
          this.searchData = response;
          this.noResults = !response.length;

          this._cdRef.markForCheck();
        });
    }
  }

  public reload() {
    this.search(null, this.keywordInput.nativeElement.value);
  }

  public focus(e) {

    if (this.readonly || this.disabled) {
      return;
    }

    if (this.fetchOnFocus && !this._model) {
      this.search(e, this.keywordInput.nativeElement.value);
    }
  }

  public blur(e) {

    if (this.readonly || this.disabled) {
      return;
    }

    setTimeout(() => {
      if (!this._model) {
        this.keyword = '';
      }

      this.searchData = [];
    }, 100);
  }

  public updateKeywordDisplay() {
    const value = this._model ? this.display(this._model) : '';
    this.keywordInput.nativeElement.value = value;

    this._cdRef.markForCheck();
  }

  public display = (data) => {
    if (data && this.displayWith) {
      return this.displayWith(data);
    }
    return '';
  }

  public optionSelected(event: MatAutocompleteSelectedEvent) {
    this.updateSelected(event.option.value);
  }

  public updateSelected(value) {
    this._model = value;
    this.searchData = [];
    this.updateKeywordDisplay();
    this._onChange(value);
  }

  public close() {
    this.autocomplete.closePanel();
  }

  public writeValue(value: any): void {
    this._model = value;
    this.updateKeywordDisplay();
  }

  public ngOnInit() {

    setTimeout(() => {
      this.writeValue(this.ngModel);
    });

    this.keyword$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(150)
      )
      .subscribe((e: any) => {
        this._onTouched();
        this.search(e, e.target.value);
      });
  }

  public keyUp(event: KeyboardEvent) {

    if (this.readonly || this.disabled) {
      return;
    }

    this.keyword$.next(event);
  }

  public keyDown(event: KeyboardEvent) {

    if (this.readonly || this.disabled) {
      return;
    }

    if (event.code === 'Tab') {
      if (this.autocomplete.activeOption && this.autocomplete.activeOption.value) {
        this.updateSelected(this.autocomplete.activeOption.value);
      }

    } else {

      if (this._model && this._ignoreKeys.indexOf(event.key) < 0) {
        this.updateSelected(null);
      }
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
