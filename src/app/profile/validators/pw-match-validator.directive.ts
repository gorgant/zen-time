import { AbstractControl, ValidatorFn } from '@angular/forms';

export function pwMustMatchValidator(params?: any): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const newPassword = control.get('newPassword');
    const confirmNewPassword = control.get('confirmNewPassword');

    if (!newPassword || !confirmNewPassword) {
      return null;
    }

    return newPassword.value === confirmNewPassword.value ? null : { 'noMatch': true  };
  };
}

export function pwMustNotMatchValidator(params?: any): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const oldPassword = control.get('oldPassword');
    const newPassword = control.get('updatedPwGroup.newPassword');

    if (!oldPassword || !newPassword) {
      return null;
    }

    return oldPassword.value !== newPassword.value ? null : { 'match': true  };
  };
}

