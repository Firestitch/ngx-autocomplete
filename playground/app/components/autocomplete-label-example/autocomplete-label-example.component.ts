import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'autocomplete-label-example',
  styleUrls: ['autocomplete-label-example.component.scss'],
  templateUrl: 'autocomplete-label-example.component.html'
})
export class AutocompleteLabelExampleComponent implements OnInit {

  @ViewChild('input', { static: true }) input;

  public user: { name: string, value: number, avatar: string } = { name: '', value: null, avatar: '' };

  private _list: { name: string, value: number, avatar: string }[] = [
    { name: 'Bob', value: 1, avatar: '' },
    { name: 'Ryan', value: 2, avatar: '' },
    { name: 'Jane', value: 3, avatar: '' },
    { name: 'Dave', value: 4, avatar: '' }
  ];

  public filteredOptions: Observable<{ name: string, value: number, avatar: any }[]>;

  constructor() {}

  ngOnInit() {

    this._list
      .forEach((item) => {
        item.avatar = 'https://randomuser.me/api/portraits/men/' + Math.floor((Math.random() * 99) + 1) + '.jpg';
      });

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
