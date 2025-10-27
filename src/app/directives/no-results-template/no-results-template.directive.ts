import { Directive, Input, TemplateRef } from '@angular/core';


@Directive({
    selector: '[fsAutocompleteNoResults]',
    standalone: true,
})
export class FsAutocompleteNoResultsDirective {

  @Input() public show: (keyword: string) => boolean;

  public isShow = true;

  constructor(
    public templateRef: TemplateRef<any>,
  ) {
    this.show = (keyword: string) => true;
  }
}
