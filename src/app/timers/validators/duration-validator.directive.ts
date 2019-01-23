import { AbstractControl, ValidatorFn } from '@angular/forms';

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
