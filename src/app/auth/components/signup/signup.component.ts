import { Component, OnInit } from '@angular/core';
import { signUpValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../models/auth-data.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TermsAndConditionsDialogueComponent } from '../terms-and-conditions-dialogue/terms-and-conditions-dialogue.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  SIGN_UP_FORM_VALIDATION_MESSAGES = signUpValidationMessages;
  LOGO_URL = imageUrls.ZEN_TIMER_LOGO;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
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
    this.store$.dispatch( new AuthStoreActions.RegisterUserRequested({authData: newUserData}));

  }

  onReadTermsAndConditions() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    const dialogRef = this.dialog.open(TermsAndConditionsDialogueComponent, dialogConfig);
  }

  // Getters for easy access to form fields
  get name() { return this.signUpForm.get('name'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get acceptTerms() { return this.signUpForm.get('acceptTerms'); }

}
