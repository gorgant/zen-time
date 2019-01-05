import { Component, OnInit } from '@angular/core';
import { signUpValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../models/auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  SIGN_UP_FORM_VALIDATION_MESSAGES = signUpValidationMessages;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: ['', Validators.requiredTrue]
    });
  }

  onSubmit() {
    const newUserData: AuthData = {
      email: this.email.value,
      password: this.password.value,
      name: this.name.value
    };
    console.log(newUserData);
  }

  // Getters for easy access to form fields
  get name() { return this.signUpForm.get('name'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get acceptTerms() { return this.signUpForm.get('acceptTerms'); }

}
