import { Action } from '@ngrx/store';
import { AuthData } from 'src/app/auth/models/auth-data.model';
import { AppUser } from 'src/app/shared/models/app-user.model';

export enum ActionTypes {
  REGISTER_USER_REQUESTED = '[Auth] Register User Requested',
  REGISTER_USER_COMPLETE = '[Auth] Register User Complete',
  AUTHENTICATION_REQUESTED = '[Auth] Authentication Requested',
  AUTHENTICATION_COMPLETE = '[Auth] Authentication Complete',
  SET_AUTHENTICATED = '[Auth] Set Authenticated',
  SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated',
  UPDATE_EMAIL_REQUESTED = '[Auth] Update Email Requested',
  UPDATE_EMAIL_COMPLETE = '[Auth] Update Email Complete',
  UPDATE_PASSWORD_REQUESTED = '[Auth] Update Password Requested',
  UPDATE_PASSWORD_COMPLETE = '[Auth] Update Password Complete',
  AUTH_LOAD_ERROR = '[Auth] Load Failure'
}

export class RegisterUserRequested implements Action {
  readonly type = ActionTypes.REGISTER_USER_REQUESTED;

  constructor(public payload: { authData: AuthData }) {}
}

export class RegisterUserComplete implements Action {
  readonly type = ActionTypes.REGISTER_USER_COMPLETE;
}

export class AuthenticationRequested implements Action {
  readonly type = ActionTypes.AUTHENTICATION_REQUESTED;

  constructor(public payload: { authData: AuthData }) {}
}

export class AuthenticationComplete implements Action {
  readonly type = ActionTypes.AUTHENTICATION_COMPLETE;
}

export class SetAuthenticated implements Action {
  readonly type = ActionTypes.SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = ActionTypes.SET_UNAUTHENTICATED;
}

export class UpdateEmailRequested implements Action {
  readonly type = ActionTypes.UPDATE_EMAIL_REQUESTED;

  constructor(public payload: { appUser: AppUser, password: string, newEmail: string }) {}
}

export class UpdateEmailComplete implements Action {
  readonly type = ActionTypes.UPDATE_EMAIL_COMPLETE;
}

export class UpdatePasswordRequested implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_REQUESTED;

  constructor(public payload: { appUser: AppUser, oldPassword: string, newPassword: string }) {}
}

export class UpdatePasswordComplete implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_COMPLETE;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.AUTH_LOAD_ERROR;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  RegisterUserRequested |
  RegisterUserComplete |
  AuthenticationRequested |
  AuthenticationComplete |
  SetAuthenticated |
  SetUnauthenticated |
  UpdateEmailRequested |
  UpdateEmailComplete |
  UpdatePasswordRequested |
  UpdatePasswordComplete |
  LoadErrorDetected
  ;
