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
import { FsAutocompleteStaticDirective } from './directives/autocomplete-static/autocomplete-static.directive';
import { FsAutocompleteNoResultsDirective } from './directives/no-results-template/no-results-template.directive';
import { FsAutocompleteHintDirective } from './directives/autocomplete-hint/autocomplete-hint.directive';
import { FsAutocompletePrefixDirective } from './directives/autocomplete-prefix/autocomplete-prefix.directive';


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
    FsAutocompletePrefixDirective,
    FsAutocompleteStaticDirective,
    FsAutocompleteNoResultsDirective,
    FsAutocompleteHintDirective,
  ],
  declarations: [
    FsAutocompleteComponent,
    FsAutocompleteTemplateDirective,
    FsAutocompleteSuffixDirective,
    FsAutocompletePrefixDirective,
    FsAutocompleteStaticDirective,
    FsAutocompleteNoResultsDirective,
    FsAutocompleteHintDirective,
  ],
  providers: [
  ],
})
export class FsAutocompleteModule {
}
