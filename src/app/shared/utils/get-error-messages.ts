export function getErrorMessages(control: any): string {
  if (!control || !control.value.errors) return '';

  return Object.keys(control.value.errors).map(errorKey => {
    switch (errorKey) {

      case 'required':
        return 'This field is required';

      case 'minlength':
        return `Minimum length is ${control.value.errors![errorKey].requiredLength}`;

      default:
        return `Error: ${errorKey}`;
    }
  }).join(', ');
}
