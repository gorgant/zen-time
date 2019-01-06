import { Action } from '@ngrx/store';
import { AppUser } from 'src/app/shared/models/app-user.model';

export enum ActionTypes {
  SET_AUTHENTICATED = '[Auth] Set Authenticated',
  SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated',
  SET_USER = '[Auth] Load User'
}

export class SetAuthenticated implements Action {
  readonly type = ActionTypes.SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = ActionTypes.SET_UNAUTHENTICATED;
}

export class SetUser implements Action {
  readonly type = ActionTypes.SET_USER;
  constructor(public payload: { user: AppUser }) {}
}

export type Actions =
  SetAuthenticated |
  SetUnauthenticated |
  SetUser;
