import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { FsApi } from '@firestitch/api';


@Component({
  selector: 'autocomplete-chips-example',
  templateUrl: './autocomplete-chips-example.component.html'
})
export class AutocompleteChipsExampleComponent implements OnInit {

  public list = [
    { name: 'Bob', value: 1 },
    { name: 'Ryan', value: 2 },
    { name: 'Jane', value: 3 },
    { name: 'Dave', value: 4 }
  ];

  public model = [];

  constructor(private fsApi: FsApi) { }

  ngOnInit() {
  }

  public fetch = keyword => {
    return this.fsApi.get('https://boilerplate.firestitch.com/api/dummy', { name: keyword })
    .map(response => response.data.objects)
    .map(response => {
      for (let key in response) {
        response[key].id = +key + 1;
      }
      return response;
    });
  }
}
