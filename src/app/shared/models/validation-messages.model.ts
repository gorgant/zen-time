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
