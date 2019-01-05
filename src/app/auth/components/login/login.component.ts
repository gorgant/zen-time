import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../models/auth-data.model';
import { loginValidationMessages } from 'src/app/shared/models/validation-messages.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LOGIN_FORM_VALIDATION_MESSAGES = loginValidationMessages;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const userAuthData: AuthData = {
      email: this.email.value,
      password: this.password.value
    };
    console.log(userAuthData);
  }

  // Getters for easy access to form fields
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
