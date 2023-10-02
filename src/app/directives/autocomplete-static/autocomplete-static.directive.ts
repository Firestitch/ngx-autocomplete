import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsAutocompleteStatic],[fsAutocompleteStaticTemplate]'
})
export class FsAutocompleteStaticDirective {

  @Input() public show = (keyword: string) => true;

  @Output() selected = new EventEmitter<string>();

  constructor(public templateRef: TemplateRef<any>) { }

  public isShow = true;
}
