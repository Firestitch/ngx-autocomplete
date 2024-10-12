import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsBadgeModule } from '@firestitch/badge';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  AutocompleteExampleComponent,
  AutocompleteLabelExampleComponent,
} from './components';
import { DialogComponent } from './components/dialog/dialog.component';
import { AppMaterialModule } from './material.module';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FsExampleModule,
    FsAutocompleteModule,
    FsBadgeModule,
    AppMaterialModule,
    RouterModule.forRoot([]),
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AutocompleteExampleComponent,
    AutocompleteLabelExampleComponent,
    DialogComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class PlaygroundModule {
}
