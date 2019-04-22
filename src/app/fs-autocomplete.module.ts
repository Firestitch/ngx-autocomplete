import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatChipsModule,
  MatInputModule,
  MatIconModule } from '@angular/material';

import { FsAutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { FsAutocompleteTemplateDirective } from './directives/autocomplete-template/autocomplete-template.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [
    FsAutocompleteComponent,
    FsAutocompleteTemplateDirective
  ],
  entryComponents: [
  ],
  declarations: [
    FsAutocompleteComponent,
    FsAutocompleteTemplateDirective
  ],
  providers: [
  ],
})
export class FsAutocompleteModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: FsAutocompleteModule,
  //   };
  // }
}
