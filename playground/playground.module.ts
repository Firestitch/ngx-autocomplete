import './styles.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';

import { FsAutocompleteModule } from '../src';

import { AppComponent } from './app/app.component';
import { AppMaterialModule } from './app/material.module';
import {
  AutocompleteExampleComponent,
  AutocompleteLabelExampleComponent
} from './app/components';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    FsExampleModule,

    FsAutocompleteModule,

    AppMaterialModule
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,

    AutocompleteExampleComponent,
    AutocompleteLabelExampleComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
