import { Component, ContentChild, TemplateRef, HostBinding, Input, forwardRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { map, takeUntil, debounceTime } from 'rxjs/operators';
import { FsAutocompleteTemplateDirective } from 'src/app/directives/autocomplete-template/autocomplete-template.directive';
import { Subject, Observable } from 'rxjs';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

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
export class FsAutocompleteComponent implements ControlValueAccessor, OnInit {

  @ContentChild(FsAutocompleteTemplateDirective, { read: TemplateRef })
  template: FsAutocompleteTemplateDirective = null;

  @HostBinding('class.fs-form-wrapper') formWrapper = true;

  @ViewChild('keywordInput') keywordInput: ElementRef;

  @Input() fetch: Function;
  @Input() placeholder = '';
  @Input() displayWith: Function;
  @Input() ngModel;

  public searchData: any[] = [];
  public keyword = '';
  public keyword$ = new Subject();
  public noResults = false;

  protected _destroy$ = new Subject();
  protected _model;

  private _onTouched = () => { };
  private _onChange = (value: any) => {};

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }


  constructor() {}


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
    this.updateKeywordDisplay();
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
      .subscribe((e) => {
        if (!this.keyword) {
          this.updateSelected(null);
        }
      });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
