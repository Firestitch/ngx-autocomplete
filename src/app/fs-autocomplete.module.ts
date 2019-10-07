import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FsAutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { FsAutocompleteTemplateDirective } from './directives/autocomplete-template/autocomplete-template.directive';
import { FsAutocompleteSuffixDirective } from './directives/autocomplete-suffix/autocomplete-suffix.directive';
import { FsAutocompleteStaticTemplateDirective } from './directives/static-template/static-template.directive';


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
    FsAutocompleteTemplateDirective,
    FsAutocompleteSuffixDirective,
    FsAutocompleteStaticTemplateDirective,
  ],
  entryComponents: [
  ],
  declarations: [
    FsAutocompleteComponent,
    FsAutocompleteTemplateDirective,
    FsAutocompleteSuffixDirective,
    FsAutocompleteStaticTemplateDirective,
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
