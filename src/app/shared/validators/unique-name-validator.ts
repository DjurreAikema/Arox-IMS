import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function uniqueNameValidator(existingNames?: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    if (!existingNames) return null;

    const filteredNames = existingNames.filter(existingName => existingName !== name);
    if (filteredNames.includes(name)) {
      return {uniqueName: {value: name}};
    }
    return null;
  };
}
