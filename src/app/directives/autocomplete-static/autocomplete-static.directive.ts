import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsAutocompleteStatic],[fsAutocompleteStaticTemplate]',
})
export class FsAutocompleteStaticDirective {

  @Input() public show: (keyword: string) => boolean;
  @Input() public disable: (keyword: string) => boolean;

  @Output() public selected = new EventEmitter<string>();

  public isShow = true;
  public isDisabled = false;

  constructor(
    public templateRef: TemplateRef<any>,
  ) {
    this.show = (keyword: string) => true;
    this.disable = (keyword: string) => false;
  }

}
