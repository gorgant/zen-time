import { Action } from '@ngrx/store';

export enum ActionTypes {
  SET_AUTHENTICATED = '[Auth] Set Authenticated',
  SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated',
}

export class SetAuthenticated implements Action {
  readonly type = ActionTypes.SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = ActionTypes.SET_UNAUTHENTICATED;
}

export type Actions =
  SetAuthenticated |
  SetUnauthenticated
  ;
