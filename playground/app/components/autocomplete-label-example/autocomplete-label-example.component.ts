import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from "rxjs/operators";


@Component({
  selector: 'autocomplete-label-example',
  templateUrl: 'autocomplete-label-example.component.html'
})
export class AutocompleteLabelExampleComponent implements OnInit {

  @ViewChild('input') input;

  public user: { name: string, value: number } = { name: '', value: null };

  private _list: { name: string, value: number }[] = [
    { name: 'Bob', value: 1 },
    { name: 'Ryan', value: 2 },
    { name: 'Jane', value: 3 },
    { name: 'Dave', value: 4 }
  ];

  public filteredOptions: Observable<{ name: string, value: number }[]>;

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.input.valueChanges
      .pipe(
        startWith(null),
        map(data => data && typeof data === 'object' ? data['name'] : data),
        map(name => name ? this.filter(String(name)) : this._list.slice())
      )
  }

  public filter(name: string) {
    return this._list.filter(option => option.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }

  public displayFn(data): string {
    return data ? data.name : data;
  }
}
