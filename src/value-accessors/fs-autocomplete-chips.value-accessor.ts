import { FsAutocompleteChipsComponent } from './../components';
import { Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const FS_AUTOCOMPLETE_CHIPS_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsAutocompleteChipsComponent),
  multi: true
};
