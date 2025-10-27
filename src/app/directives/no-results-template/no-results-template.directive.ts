import { Directive, Input, TemplateRef, inject } from '@angular/core';


@Directive({
    selector: '[fsAutocompleteNoResults]',
    standalone: true,
})
export class FsAutocompleteNoResultsDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  @Input() public show: (keyword: string) => boolean;

  public isShow = true;

  constructor() {
    this.show = (keyword: string) => true;
  }
}
