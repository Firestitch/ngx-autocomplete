import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import {
  MatAutocompleteModule,
  MatChipsModule,
  MatInputModule,
  MatIconModule } from '@angular/material';

import {
  FsAutocompleteComponent,
  FsAutocompleteChipsComponent
} from './components';

import { FsAutocompleteChipDirective, FsAutocompleteDirective } from './directives';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    FsAutocompleteComponent,
    FsAutocompleteChipsComponent,
    FsAutocompleteChipDirective,
    FsAutocompleteDirective
  ],
  entryComponents: [
  ],
  declarations: [
    FsAutocompleteComponent,
    FsAutocompleteChipsComponent,
    FsAutocompleteChipDirective,
    FsAutocompleteDirective
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
