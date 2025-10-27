import { Directive, EventEmitter, Input, Output, TemplateRef, inject } from '@angular/core';


@Directive({
    selector: '[fsAutocompleteStatic],[fsAutocompleteStaticTemplate]',
    standalone: true,
})
export class FsAutocompleteStaticDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  @Input() public show: (keyword: string) => boolean;
  @Input() public disable: (keyword: string) => boolean;

  @Output() public selected = new EventEmitter<string>();

  public isShow = true;
  public isDisabled = false;

  constructor() {
    this.show = (keyword: string) => true;
    this.disable = (keyword: string) => false;
  }

}
