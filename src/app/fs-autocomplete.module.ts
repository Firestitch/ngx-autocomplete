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
import { FsAutocompleteNoResultsDirective } from './directives/no-results-template/no-results-template.directive';


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
    FsAutocompleteNoResultsDirective
  ],
  declarations: [
    FsAutocompleteComponent,
    FsAutocompleteTemplateDirective,
    FsAutocompleteSuffixDirective,
    FsAutocompleteStaticTemplateDirective,
    FsAutocompleteNoResultsDirective
  ],
  providers: [
  ],
})
export class FsAutocompleteModule {
}
