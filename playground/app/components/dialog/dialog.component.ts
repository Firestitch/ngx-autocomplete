import { Component } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: 'dialog.component.html',
    standalone: true,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, FormsModule, MatDialogActions, MatButton, MatDialogClose]
})
export class DialogComponent {
  public test;
}
