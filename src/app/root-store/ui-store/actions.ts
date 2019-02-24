import { Action } from '@ngrx/store';


export enum ActionTypes {
  APP_ONLINE = '[Connection] App is Online',
  APP_OFFLINE = '[Connection] App is Offline'
}

export class AppOnline implements Action {
  readonly type = ActionTypes.APP_ONLINE;
}

export class AppOffline implements Action {
  readonly type = ActionTypes.APP_OFFLINE;
}

export type Actions =
  AppOnline |
  AppOffline
  ;
