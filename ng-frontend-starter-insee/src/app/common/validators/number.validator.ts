import {
  AbstractControl
} from '@angular/forms';

export const ValidateNumber = (min?: number, max?: number, decimal?: boolean) => {
  return (control: AbstractControl): { [key: string]: boolean } => {
    const input = control;
    let NUMBER_REGEXP = /^\d+$/;
    if (decimal) {
      NUMBER_REGEXP = /^(\d*\.)?\d+$/;
      // allow negative decimal
      // ^-?(0?|(([1-9]{1}\d{0,2})(,\d{1,3})*|[1-9]+\d*))(\.(0{1}|\d*[1-9]{1})(e(0|[1-9]{1}\d*))?)?$
    }
    if (!input || input.value === '' || input.value === null || input.value === undefined) {
      return null;
    }
    if (!NUMBER_REGEXP.test(input.value)) {
      return { number: true };
    }
    if (min && input.value < min) {
      return { range: true };
    }
    if (max && input.value > max) {
      return { range: true };
    }

    return null;
  };
};
