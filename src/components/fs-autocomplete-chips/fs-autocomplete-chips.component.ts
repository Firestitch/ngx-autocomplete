import { Component, Input, Output, EventEmitter, ElementRef, ContentChild, TemplateRef,
  OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { DragulaService } from 'ng2-dragula';

import { filter, list, sort, indexOf } from '@firestitch/common/array';

import { FsAutocompleteChipDirective, FsAutocompleteDirective } from './../../directives';

import { FS_AUTOCOMPLETE_CHIPS_ACCESSOR } from './../../value-accessors';


@Component({
  selector: 'fs-autocomplete-chips',
  templateUrl: './fs-autocomplete-chips.component.html',
  styleUrls: [ './fs-autocomplete-chips.component.scss' ],
  providers: [FS_AUTOCOMPLETE_CHIPS_ACCESSOR]
})
export class FsAutocompleteChipsComponent implements OnInit {

  @Input() public fetch = null;

  @Input() public placeholder = '';
  @Input() public removable = false;
  @Input() public addOnBlur = false;
  @Input() public selectable = true;
  @Input() public draggable = false;
  @Input() public indexField = 'id';

  @Output() selected = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() drop = new EventEmitter<any>();

  public keyword = null;
  public autocompleteData: object[] = null;

  public separatorKeysCodes = [ENTER, COMMA];

  private _model = [];

  public get model () {
    return this._model;
  }

  @ContentChild(FsAutocompleteChipDirective, { read: TemplateRef }) chipTemplate: FsAutocompleteChipDirective = null;
  @ContentChild(FsAutocompleteDirective, { read: TemplateRef }) autocompleteTemplate: FsAutocompleteDirective = null;

  @ViewChild('keywordInput') keywordInput: ElementRef = null;

  _onTouched = () => { };
  _onChange = (value: any) => { };
  onFocused = (event: any) => { };

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(private dragula: DragulaService) { }

  private onDrop(args) {

    const model = [];
    const [el, parent] = args;

    // const newPosition = this.getElementIndex(el);

    // const existingElement = model[newPosition] ? model[newPosition] : null;
    // const draggableItem = filter(model, { [this.indexField]: el.getAttribute('data-id') })[0];

    for (var i = 0; i < parent.childNodes.length; i++) {
      if (parent.childNodes[i].tagName === 'MAT-CHIP') {
        const item = filter(this.model, { [this.indexField]: parent.childNodes[i].getAttribute('data-id') })[0];
        model.push(item);
      }
    }

    this.writeValue(model);
    this.drop.emit(model);
  }

  private getElementIndex(el: any) {
    return [].slice.call(el.parentElement.children).indexOf(el);
  }

  ngOnInit() {
    if (this.draggable) {
      this.dragula.setOptions('bag-chips', {
        isContainer(el) {
          return el.classList.contains('mat-chip-list-wrapper');
        },
        direction: 'horizontal'
      });

      this.dragula.drop.subscribe((value) => {
        this.onDrop(value.slice(1));
      });
    }
  }

  writeValue(value: any): void {
    value = Array.isArray(value) ? value : [];

    this._model = value;
    this._onChange(this._model);
  }

  keywordChange() {

    this.autocompleteData = [];

    if (!this.fetch) {
      return;
    }

    this.fetch(this.keyword)
    .subscribe(response => {

      const selected = list(this.model, this.indexField);

      this.autocompleteData = filter(response, item => selected.indexOf(item[this.indexField]) === -1);
    });
  }

  add(event: MatChipInputEvent): void {
    // User should select from the list
  }

  onSelected (event: MatAutocompleteSelectedEvent): void {
    this.writeValue([...this._model, ...[event.option.value]]);
    this.keyword = '';
    this.keywordInput.nativeElement.value = '';
    this.selected.emit(event.option.value);
  }

  onRemove(item) {

    const model = this.model.slice();

    const index = indexOf(model, value => {
      return value[this.indexField] === item[this.indexField];
    });

    if (index !== -1) {
      model.splice(index, 1);
      this.writeValue(model);
      this.remove.emit(item);
    }
  }
}
