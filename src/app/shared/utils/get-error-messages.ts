export function getErrorMessages(control: any): string {
  if (!control || !control.value.errors) return '';

  // POI: Add messages to form errors
  return Object.keys(control.value.errors).map(errorKey => {
    switch (errorKey) {

      case 'required':
        return 'This field is required';

      case 'minlength':
        return `Minimum length is ${control.value.errors![errorKey].requiredLength}`;

      case 'uniqueName':
        return `Tool input name is not unique`;

      default:
        return `Error: ${errorKey}`;

    }
  }).join(', ');
}
