export const signUpValidationMessages = {
  'name': [
    { type: 'required', message: 'Name is required.'},
  ],
  'email': [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  'password': [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: 'Must be at least 6 characters' },
  ],
  'acceptTerms': [
    { type: 'required', message: 'You must accept our terms and conditions to proceed.' },
  ],
};

export const loginValidationMessages = {
  'email': [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  'password': [
    { type: 'required', message: 'Password is required.' },
  ]
};

export const TimerFormValidationMessages = {
  'title': [
    { type: 'required', message: 'Title is required.'},
  ],
  'category': [
    { type: 'required', message: 'Category is required.' },
  ],
  'notes': [
    { type: 'required', message: 'Notes is required.' },
  ],
  'duration': [
    { type: 'noDuration', message: 'Duration is required.' },
    { type: 'durationZeroOrLess', message: 'Duration must be greater than 0.' },
    { type: 'durationNotWholeNumber', message: 'Duration must be a whole number.' },
  ],
};

export const NameFormValidationMessages = {
  'name': [
    { type: 'required', message: 'You must provide a name.'},
  ],
};

export const EmailFormValidationMessages = {
  'email': [
    { type: 'required', message: 'You must provide an email.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  'password': [
    { type: 'required', message: 'You must confirm your current password.'},
  ]
};

export const PasswordFormValidationMessages = {
  'oldPassword': [
    { type: 'required', message: 'You must provide your current password.'},
  ],
  'newPassword': [
    { type: 'required', message: 'You must provide a new password.'},
    { type: 'minlength', message: 'Must be at least 6 characters' },
  ],
  'confirmNewPassword': [
    { type: 'required', message: 'You must confirm your new password.'},
  ],
  'updatedPwGroup': [
    { type: 'noMatch', message: 'Your new passwords must match.'},
  ],
  'oldPwGroup': [
    { type: 'match', message: 'Your new password cannot match your old password.'}
  ]
};
