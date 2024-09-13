import {Component, ContentChild, inject, Input, TemplateRef} from '@angular/core';
import {Dialog} from "@angular/cdk/dialog";

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div></div>
  `,
})
// Responsibility: Dumb component that lets us show a modal more easily
// TODO: Better explanation of what this component does exactly, a new developer would not understand what is happening here
export class ModalComponent {

  public dialog: Dialog = inject(Dialog);

  // Get a reference to a TemplateRef that is supplies inside the <app-modal> selector.
  @ContentChild(TemplateRef, {static: false}) template!: TemplateRef<any>;

  // Open and close the dialog based on a Signal input
  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template, {panelClass: 'dialog-container'});
    } else {
      this.dialog.closeAll();
    }
  }
}
