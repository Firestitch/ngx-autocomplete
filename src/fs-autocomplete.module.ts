import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FsAutocompleteComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsAutocompleteComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsAutocompleteComponent,
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
