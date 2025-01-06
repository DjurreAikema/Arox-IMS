import {FormGroup, FormControl} from '@angular/forms';

interface ControlConfigInput {
  label?: string;
  placeholder?: string;
  type?: string;
  selectOptions?: { value: any, label: string }[];
}

interface ControlConfig {
  label: string;
  placeholder: string;
  type: string;
  selectOptions: { value: any, label: string }[];
}

export class CustomFormGroup extends FormGroup {

  public controlConfigs: { [key: string]: ControlConfig };

  constructor(
    controls: { [key: string]: FormControl },
    controlConfigsInput: { [key: string]: ControlConfigInput }
  ) {
    super(controls);
    this.controlConfigs = {};

    // Apply default values
    for (const key in controlConfigsInput) {
      this.controlConfigs[key] = {
        label: controlConfigsInput[key].label || 'Label',
        placeholder: controlConfigsInput[key].placeholder || 'Placeholder',
        type: controlConfigsInput[key].type || 'text',
        selectOptions: controlConfigsInput[key].selectOptions || [],
      }
    }
  }

  public getLabel(controlKey: string): string {
    return this.controlConfigs[controlKey].label;
  }

  public getPlaceholder(controlKey: string): string {
    return this.controlConfigs[controlKey].placeholder;
  }

  public getType(controlKey: string): string {
    return this.controlConfigs[controlKey].type;
  }

  public getOptions(controlKey: string): { value: any, label: string }[] {
    console.log(this.controlConfigs[controlKey].selectOptions);
    return this.controlConfigs[controlKey].selectOptions;
  }

  public isDirty(controlKey: string): boolean {
    const control = this.get(controlKey);
    return control ? control.dirty : false;
  }

  public isTouched(controlKey: string): boolean {
    const control = this.get(controlKey);
    return control ? control.touched : false;
  }

  public isValid(controlKey: string): boolean {
    const control = this.get(controlKey);
    return control ? control.valid : false;
  }

}
