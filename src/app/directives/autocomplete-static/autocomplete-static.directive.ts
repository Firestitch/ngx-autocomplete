import { Directive, Output, EventEmitter, Input, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsAutocompleteStatic],[fsAutocompleteStaticTemplate]'
})
export class FsAutocompleteStaticDirective {

  @Input()
  public showWhenKeyword = false

  @Output() selected = new EventEmitter<string>();

  constructor(public templateRef: TemplateRef<any>) {
  }
}
