import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { FsAutocompleteComponent } from '@firestitch/autocomplete';
import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FsAutocompleteComponent as FsAutocompleteComponent_1 } from '../../../../src/app/components/autocomplete/autocomplete.component';
import { FormsModule } from '@angular/forms';
import { FsAutocompleteTemplateDirective } from '../../../../src/app/directives/autocomplete-template/autocomplete-template.directive';
import { FsBadgeModule } from '@firestitch/badge';
import { FsAutocompleteNoResultsDirective } from '../../../../src/app/directives/no-results-template/no-results-template.directive';
import { MatOption } from '@angular/material/core';
import { FsAutocompleteStaticDirective } from '../../../../src/app/directives/autocomplete-static/autocomplete-static.directive';
import { FsAutocompletePrefixDirective } from '../../../../src/app/directives/autocomplete-prefix/autocomplete-prefix.directive';
import { MatIcon } from '@angular/material/icon';
import { FsAutocompleteHintDirective } from '../../../../src/app/directives/autocomplete-hint/autocomplete-hint.directive';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'autocomplete-example',
    templateUrl: './autocomplete-example.component.html',
    styleUrls: ['./autocomplete-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsAutocompleteComponent_1,
        FormsModule,
        FsAutocompleteTemplateDirective,
        FsBadgeModule,
        FsAutocompleteNoResultsDirective,
        MatOption,
        FsAutocompleteStaticDirective,
        FsAutocompletePrefixDirective,
        MatIcon,
        FsAutocompleteHintDirective,
        MatButton,
        JsonPipe,
    ],
})
export class AutocompleteExampleComponent implements OnInit {

  @ViewChild(FsAutocompleteComponent, { static: true })
  public autocomplete: FsAutocompleteComponent;

  public model;
  public city;

  private _list: { name: string; value: number; image: string }[] = [
    { name: 'Bob', value: 1, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { name: 'Ryan', value: 2, image: 'https://randomuser.me/api/portraits/men/20.jpg' },
    { name: 'Jane', value: 3, image: 'https://randomuser.me/api/portraits/women/30.jpg' },
    { name: 'Dave', value: 4, image: 'https://randomuser.me/api/portraits/men/40.jpg' },
    { name: 'Joe', value: 4, image: 'https://randomuser.me/api/portraits/men/50.jpg' },
    { name: 'Wendy', value: 4, image: 'https://randomuser.me/api/portraits/women/60.jpg' },
    { name: 'Jill', value: 4, image: 'https://randomuser.me/api/portraits/women/70.jpg' },
    { name: 'Ryan', value: 4, image: 'https://randomuser.me/api/portraits/men/80.jpg' },
    { name: 'Sally', value: 4, image: 'https://randomuser.me/api/portraits/women/90.jpg' },
    { name: 'Howard', value: 4, image: 'https://randomuser.me/api/portraits/men/99.jpg' },
  ];

  constructor(
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit() {
    this.model = this._list[0];
    // setTimeout(() => {
    //   this.model = this._list[1];
    //   this._cdRef.markForCheck();
    // }, 1500);
  }

  public fetch = (name: string) => {
    return of(this._list)
      .pipe(
        delay(100),
        map((data) => {
          console.log('test');

          return data.filter((item) => {
            return item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
          });
        }),
      );
  };

  public displayWith = (data) => {
    return data.name;
  };

  public customStaticClick(data) {
    console.log(data);
  }

  public staticClick(name) {
    this.model = { name };
    this._message.success(`${name  } Selected`);
  }

  public showJustUse = (keyword) => {
    return !!keyword;
  };

  public disableStatic = (keyword) => {
    return !keyword;
  };

  public showResults = (keyword) => {
    return true;
  };

  public modelChange(event) {
    console.log(event);
  }

  public onProceed(data) {
    console.log(data);
  }

  public focus() {
    this.autocomplete.focus();
  }
}
