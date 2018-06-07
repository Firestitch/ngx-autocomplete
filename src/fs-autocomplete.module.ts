import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatChipsModule,
  MatInputModule,
  MatIconModule } from '@angular/material';

import {
  FsAutocompleteComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    FsAutocompleteComponent
  ],
  entryComponents: [
  ],
  declarations: [
    FsAutocompleteComponent
  ],
  providers: [
  ],
})
export class FsAutocompleteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsAutocompleteModule,
    };
  }
}
