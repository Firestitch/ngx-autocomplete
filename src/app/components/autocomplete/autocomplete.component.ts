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
  QueryList,
  EventEmitter,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trim, random, isObject } from 'lodash-es';

import { FsAutocompleteTemplateDirective } from '../../directives/autocomplete-template/autocomplete-template.directive';
import { FsAutocompleteSuffixDirective } from '../../directives/autocomplete-suffix/autocomplete-suffix.directive';
import { FsAutocompleteStaticDirective } from '../../directives/autocomplete-static/autocomplete-static.directive';
import { FsAutocompleteNoResultsDirective } from '../../directives/no-results-template/no-results-template.directive';
import { MatOptionSelectionChange } from '@angular/material/core';


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

  @ContentChildren(FsAutocompleteStaticDirective, { read: TemplateRef })
  public staticTemplates: TemplateRef<FsAutocompleteStaticDirective>[] = null;

  @ContentChildren(FsAutocompleteStaticDirective)
  public staticDirectives: QueryList<FsAutocompleteStaticDirective>;

  @ContentChild(FsAutocompleteNoResultsDirective, { read: TemplateRef, static: true })
  public noResultsTemplate: TemplateRef<FsAutocompleteNoResultsDirective>[] = null;

  @ContentChild(FsAutocompleteSuffixDirective, { read: TemplateRef, static: true })
  public suffix: TemplateRef<FsAutocompleteSuffixDirective> = null;

  @HostBinding('class.fs-form-wrapper') formWrapper = true;

  @ViewChild('keywordInput', { static: true }) keywordInput: ElementRef;

  @Input() public fetch: Function = null;
  @Input() public placeholder = '';
  @Input() public displayWith: Function = null;
  @Input() public fetchOnFocus = false;
  @Input() public readonly = false;
  @Input() public ngModel;

  @Input('panelClass')
  set setPanelClass(value) {
    this.panelClasses.push(value);
  }

  @Output() public cleared = new EventEmitter();

  public disabled = false;
  public data: any[] = [];
  public keyword = '';
  public panelClasses = ['fs-autocomplete-panel'];
  public keyword$ = new Subject();
  public noResults = false;
  public name = 'autocomplete_'.concat(random(1, 9999999));
  public model = null;
  public searching = false;

  private _destroy$ = new Subject();
  private _ignoreKeys = ['Enter', 'Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight',
                          'ArrowDown', 'Alt', 'Control', 'Shift', 'Tab']
  private _onTouched = () => { };
  private _onChange = (value: any) => {};

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {

    // Because the input display is set natively the delay
    // ensure its set after this.keyword
    setTimeout(() => {
      this.writeValue(this.ngModel);
    });

    // _setValueAndClose() override to change the order of focus() and _onChange()
    const autocompleteTrigger = (<any>this.autocomplete);
    autocompleteTrigger._setValueAndClose = (event: MatOptionSelectionChange) => {

      if (event && event.source) {
        autocompleteTrigger._clearPreviousSelectedOption(event.source);
        autocompleteTrigger._setTriggerValue(event.source.value);
        autocompleteTrigger._onChange(event.source.value);
        autocompleteTrigger.autocomplete._emitSelectEvent(event.source);

        if (event.source.value.staticOptionIndex === undefined) {
          autocompleteTrigger._element.nativeElement.focus();
        }

      } else {
        this.model = null;
      }

      autocompleteTrigger.closePanel();
    }

    this.keyword$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(150)
      )
      .subscribe((event: any) => {
        this._onTouched();
        this.search(event, event.target.value);
      });
  }

  public search(event: KeyboardEvent, keyword) {

    if (event) {
      if (this._ignoreKeys.indexOf(event.key) >= 0) {
        return;
      }
    }

    if (this.fetch) {

      this.searching = true;
      this._cdRef.markForCheck();

      this.fetch(trim(keyword))
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(response => {
          this.data = response;
          this.noResults = !response.length;
          this._cdRef.markForCheck();
          this.autocomplete.openPanel();
          this.searching = false;
        });
    }
  }

  public reload() {
    this.search(null, this._getKeyword());
  }

  public focus() {
    this.keywordInput.nativeElement.focus();
  }

  public inputFocus(e: KeyboardEvent) {

    if (this.readonly || this.disabled) {
      return;
    }

    if (this.fetchOnFocus) {
      if (!this.model) {
        this.search(e, this._getKeyword());
      }
    }
  }

  public inputBlur() {

    if (this.readonly || this.disabled) {
      return;
    }

    setTimeout(() => {

      if (!this.model) {
        this.clear();
      }

      this.clearResults();
    }, 200);
  }

  public display = (data) => {
    if (data && this.displayWith) {
      return this.displayWith(data);
    }
    return '';
  }

  public select(value) {
    if (isObject(value) && value.staticOptionIndex !== undefined) {
      this.staticSelect(value.staticOptionIndex);
    } else {
      this.model = value;
      this.data = [];
      this._updateKeywordDisplay();
      this._onChange(value);
    }
    this.clearResults();
  }

  public optionSelected(event: MatAutocompleteSelectedEvent) {
    this.select(event.option.value);
    this.autocomplete.closePanel();
  }

  public close() {
    this.autocomplete.closePanel();
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

    this.keyword$.next(event);
  }

  public keyDown(event: KeyboardEvent) {

    if (this.readonly || this.disabled) {
      return;
    }

    if (event.code === 'Tab') {
      if (!this.model && this.autocomplete.activeOption) {
        this.select(this.autocomplete.activeOption.value);
      }

    } else {

      if (this.model && this._ignoreKeys.indexOf(event.key) < 0) {
        this.clear();
      }
    }
  }

  public keyUp(event: any) {

    if (this.readonly || this.disabled) {
      return;
    }

    if (event.code === 'Backspace' && !event.target.value.length) {
      this.clear();
      this.reload();
    }
  }

  public staticClick(event: KeyboardEvent, index) {
    this.staticSelect(index);
  }

  public staticSelect(index) {
    const staticDirective: FsAutocompleteStaticDirective = this.staticDirectives.toArray()[index];
    staticDirective.selected.emit();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clearResults() {
    this.data = [];
    this.noResults = false;
    this.autocomplete.closePanel();
  }

  public clear() {
    this.clearResults();
    this.model = null;
    this.keyword = null;
    this._updateKeywordDisplay();
    this._onChange(null);
  }

  public clearClick(event: KeyboardEvent) {
    event.stopPropagation();
    this.clear();
    this.keywordInput.nativeElement.focus();
    this.cleared.emit();
  }

  private _updateKeywordDisplay() {
    const value = this.model ? this.display(this.model) : '';
    this.keywordInput.nativeElement.value = value;

    this._cdRef.markForCheck();
  }

  private _getKeyword() {
    return this.keywordInput.nativeElement.value;
  }
}
