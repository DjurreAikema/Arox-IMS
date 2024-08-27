import {FormGroup, FormControl} from '@angular/forms';

export class CustomFormGroup extends FormGroup {
  constructor(
    controls: { [key: string]: FormControl },
    public labels: { [key: string]: string },
    public placeholders: { [key: string]: string }
  ) {
    super(controls);
  }
}
