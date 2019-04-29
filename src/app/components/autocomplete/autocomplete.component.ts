import {
  Component,
  ContentChild,
  TemplateRef,
  HostBinding,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  FsAutocompleteTemplateDirective
} from '../../directives/autocomplete-template/autocomplete-template.directive';
import {
  FsAutocompleteSuffixDirective
} from '../../directives/autocomplete-suffix/autocomplete-suffix.directive';


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
  ]
})
export class FsAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ContentChild(FsAutocompleteTemplateDirective, { read: TemplateRef })
  public template: FsAutocompleteTemplateDirective = null;

  @ContentChild(FsAutocompleteSuffixDirective, { read: TemplateRef })
  public suffix: FsAutocompleteSuffixDirective = null;

  @HostBinding('class.fs-form-wrapper') formWrapper = true;

  @ViewChild('keywordInput') keywordInput: ElementRef;

  @Input() public fetch: Function = null;
  @Input() public placeholder = '';
  @Input() public displayWith: Function = null;
  @Input() public ngModel = null;

  public searchData: any[] = [];
  public keyword = '';
  public keyword$ = new Subject();
  public noResults = false;

  protected _destroy$ = new Subject();
  protected _model = null;

  private _onTouched = () => { };
  private _onChange = (value: any) => {};

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor() { }

  public search(e, keyword) {
    if (!keyword) {
      this.searchData = [];
      this.noResults = false;
      return;
    }

    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      return;
    }

    if (this.fetch) {
      this.fetch(keyword)
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(response => {
          this.searchData = response;
          this.noResults = !response.length;
        });
    }
  }

  public blur() {
    setTimeout(() => {
      this.updateKeywordDisplay();
    }, 50);
  }

  public updateKeywordDisplay() {

    const value = this._model ? this.display(this._model) : '';
    this.keywordInput.nativeElement.value = value;
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
    this._onChange(value);
    this._onTouched();
    this._model = value;
  }

  public writeValue(value: any): void {
    this._model = value;
    // updateKeywordDisplay doesn't work without timeout
    this.blur();
  }

  public ngOnInit() {
    this.keyword$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(300)
      )
      .subscribe((e: any) => {
        this.search(e, e.target.value);
      });

    this.keyword$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(e => {
        if (!this.keyword) {
          this.updateSelected(null);
        }
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
