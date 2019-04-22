import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsBadgeModule } from '@firestitch/badge';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsMessageModule } from '@firestitch/message';
import { FsFormModule } from '@firestitch/form';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import {
  AutocompleteExampleComponent,
  AutocompleteLabelExampleComponent,
} from './components';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    FsExampleModule,
    FsAutocompleteModule,
    FsBadgeModule,
    FsFormModule,
    FsAutocompleteModule,

    AppMaterialModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,

    AutocompleteExampleComponent,
    AutocompleteLabelExampleComponent,
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
