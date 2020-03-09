import { Directive, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[fsAutocompleteStatic],[fsAutocompleteStaticTemplate]'
})
export class FsAutocompleteStaticDirective {
  @Output() click = new EventEmitter();
}
