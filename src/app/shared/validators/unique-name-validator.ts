import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function uniqueNameValidator(existingNames?: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    if (!existingNames) return null;
    if (existingNames.includes(name)) {
      return {uniqueName: {value: name}};
    }
    return null;
  };
}
