import { Directive, Output, EventEmitter, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[fsAutocompleteStaticTemplate],[fsAutocompleteStatic]'
})
export class FsAutocompleteStaticTemplateDirective {

  public test = false

  @Output() click = new EventEmitter();

  ngOnInit() {

    // this.click.subscribe(() => {
    //   debugger;
    // });
  }
}
