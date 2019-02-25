import { Action } from '@ngrx/store';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { PushSubTokenSw } from 'src/app/shared/models/push-sub-token-sw.model';
import { PushSubTokenFcm } from 'src/app/shared/models/push-sub-token-fcm.model';
import { StoreUserDataType } from 'src/app/shared/models/store-user-data-type.model';

export enum ActionTypes {
  USER_DATA_REQUESTED = '[User] User Data Requested',
  USER_DATA_LOADED = '[User] User Data Loaded',
  STORE_USER_DATA_REQUESTED = '[User] Store User Data Requested',
  STORE_USER_DATA_COMPLETE = '[User] User Data Stored',
  UPDATE_PASSWORD_REQUESTED = '[User] Update Password Requested',
  UPDATE_PASSWORD_COMPLETE = '[User] Password Updated',
  UPDATE_PROFILE_IMAGE_REQUESTED = '[User] Update Profile Image Requested',
  UPDATE_PROFILE_IMAGE_COMPLETE = '[User] Update Profile Image Complete',
  PUSH_SUB_REQUESTED = '[User] Subscribe Push Requested',
  PUSH_SUB_COMPLETE = '[User] Subscribe Push Complete',
  STORE_PUSH_SUB_TOKEN_REQUESTED = '[User] Store Push Sub Requested',
  STORE_PUSH_SUB_TOKEN_COMPLETE = '[User] Store Push Sub Complete',
  USER_DATA_LOAD_ERROR = '[User] Load Failure',
  SET_PUSH_PERMISSION = '[User] Push Permission Set'
}

export class UserDataRequested implements Action {
  readonly type = ActionTypes.USER_DATA_REQUESTED;

  constructor(public payload: { userId: string }) {}
}

export class UserDataLoaded implements Action {
  readonly type = ActionTypes.USER_DATA_LOADED;

  constructor(public payload: { userData: AppUser }) {}
}

export class StoreUserDataRequested implements Action {
  readonly type = ActionTypes.STORE_USER_DATA_REQUESTED;

  constructor(public payload: { userData: AppUser, userId: string, requestType?: StoreUserDataType}) {}
}

export class StoreUserDataComplete implements Action {
  readonly type = ActionTypes.STORE_USER_DATA_COMPLETE;
}

export class UpdatePasswordRequested implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_REQUESTED;

  constructor(public payload: { currentPw: string, newPw: string }) {}
}

export class UpdatePasswordComplete implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_COMPLETE;
}

export class UpdateProfileImageRequested implements Action {
  readonly type = ActionTypes.UPDATE_PROFILE_IMAGE_REQUESTED;

  constructor(public payload: { imageFile: Blob, user: AppUser }) {}
}

export class UpdateProfileImageComplete implements Action {
  readonly type = ActionTypes.UPDATE_PROFILE_IMAGE_COMPLETE;
}

export class PushSubRequested implements Action {
  readonly type = ActionTypes.PUSH_SUB_REQUESTED;

  constructor(public payload: {userId: string, publicKey: string }) {}
}

export class PushSubComplete implements Action {
  readonly type = ActionTypes.PUSH_SUB_COMPLETE;
}

export class StorePushSubTokenRequested implements Action {
  readonly type = ActionTypes.STORE_PUSH_SUB_TOKEN_REQUESTED;

  constructor(public payload: {userId: string, pushSub: PushSubTokenSw | PushSubTokenFcm }) {}
}

export class StorePushSubTokenComplete implements Action {
  readonly type = ActionTypes.STORE_PUSH_SUB_TOKEN_COMPLETE;
}

export class SetPushPermission implements Action {
  readonly type = ActionTypes.SET_PUSH_PERMISSION;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.USER_DATA_LOAD_ERROR;
  constructor(public payload: { error: string }) {}
}

export type Actions =
UserDataRequested |
UserDataLoaded |
StoreUserDataRequested |
StoreUserDataComplete |
UpdatePasswordRequested |
UpdatePasswordComplete |
UpdateProfileImageRequested |
UpdateProfileImageComplete |
PushSubRequested |
PushSubComplete |
StorePushSubTokenRequested |
StorePushSubTokenComplete |
LoadErrorDetected |
SetPushPermission
;
