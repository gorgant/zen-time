import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../models/auth-data.model';
import { loginValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions, AuthStoreSelectors, UserStoreSelectors } from 'src/app/root-store';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ResetPasswordDialogueComponent } from '../reset-password-dialogue/reset-password-dialogue.component';
import { AuthenticateUserType } from 'src/app/shared/models/authenticate-user-type.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LOGIN_FORM_VALIDATION_MESSAGES = loginValidationMessages;
  LOGO_URL = imageUrls.ZEN_TIMER_LOGO;
  loginForm: FormGroup;
  useEmailLogin: boolean;
  userAuth$: Observable<boolean>;
  userLoaded$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    // These power the user-loading-spinner
    this.userAuth$ = this.store$.select(AuthStoreSelectors.selectIsAuth);
    this.userLoaded$ = this.store$.select(UserStoreSelectors.selectUserLoaded);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  onGoogleLogin() {
    this.store$.dispatch(new AuthStoreActions.AuthenticationRequested(
      {requestType: AuthenticateUserType.GOOGLE_AUTH}
    ));
  }

  onUseEmail() {
    this.useEmailLogin = true;
  }

  onEmailLogin() {
    const userAuthData: AuthData = {
      email: this.email.value,
      password: this.password.value
    };
    this.store$.dispatch(new AuthStoreActions.AuthenticationRequested(
      {authData: userAuthData, requestType: AuthenticateUserType.EMAIL_AUTH}
    ));
  }

  onResetPassword() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';

    dialogConfig.data = this.email.value;

    const dialogRef = this.dialog.open(ResetPasswordDialogueComponent, dialogConfig);
  }

  // Getters for easy access to form fields
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
