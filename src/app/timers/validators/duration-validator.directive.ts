import { AbstractControl, ValidatorFn } from '@angular/forms';

// // This is the static (non-function) version
// export const durationValidator = (control: AbstractControl): {[key: string]: boolean} => {
//   const weeks = control.get('weeks');
//   const days = control.get('days');
//   const hours = control.get('hours');
//   const minutes = control.get('minutes');
//   if (!weeks.value && !days.value && !hours.value && !minutes.value) {
//     return {'noDuration': true};
//   }
//   return null;
// };

// This is the function version that allows us to pass a parameter
export function durationValidator(params?: any): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const weeks = control.get('weeks');
    const days = control.get('days');
    const hours = control.get('hours');
    const minutes = control.get('minutes');
    const durationTotal = weeks.value + days.value + hours.value + minutes.value;
    if (!weeks.value && !days.value && !hours.value && !minutes.value) {
      return {'noDuration': true};
    }
    if (durationTotal <= 0) {
      return {'durationZeroOrLess': true};
    }

    if (durationTotal % 1 !== 0) {
      return {'durationNotWholeNumber': true};
    }
    return null;
  };
}
