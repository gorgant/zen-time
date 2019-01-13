import { Action } from '@ngrx/store';
import { Timer } from 'src/app/timers/models/timer.model';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  SINGLE_DONE_REQUESTED = '[Done] Single Done Requested',
  SINGLE_DONE_LOADED = '[Done] Single Done Loaded',
  ALL_DONE_REQUESTED = '[Done] All Done Requested',
  ALL_DONE_LOADED = '[Done] All Done Loaded',
  DONE_LOAD_FAILURE = '[Done] Load Failure',
  UPDATE_DONE_REQUESTED = '[Done] Done Update Requested',
  UPDATE_DONE_COMPLETE = '[Done] Done Updated',
  ADD_DONE_REQUESTED = '[Done] Save Done Requested',
  ADD_DONE_COMPLETE = '[Done] Done Saved',
  DELETE_DONE_REQUESTED = '[Done] Done Delete Requested ',
  DELETE_DONE_COMPLETE = '[Done] Done Deleted',
}

export class SingleDoneRequested implements Action {
  readonly type = ActionTypes.SINGLE_DONE_REQUESTED;
  constructor (public payload: { timerId: string }) {}
}

export class SingleDoneLoaded implements Action {
  readonly type = ActionTypes.SINGLE_DONE_LOADED;
  constructor (public payload: { timer: Timer }) {}
}

export class AllDoneRequested implements Action {
  readonly type = ActionTypes.ALL_DONE_REQUESTED;
}

export class AllDoneLoaded implements Action {
  readonly type = ActionTypes.ALL_DONE_LOADED;
  constructor(public payload: { timers: Timer[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.DONE_LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UpdateDoneRequested implements Action {
  readonly type = ActionTypes.UPDATE_DONE_REQUESTED;

  constructor(public payload: {timer: Timer}) {}
}

export class UpdateDoneComplete implements Action {
  readonly type = ActionTypes.UPDATE_DONE_COMPLETE;

  constructor(public payload: {timer: Update<Timer>}) {}
}

export class AddDoneRequested implements Action {
  readonly type = ActionTypes.ADD_DONE_REQUESTED;

  constructor(public payload: {timer: Timer}) {}
}

export class AddDoneComplete implements Action {
  readonly type = ActionTypes.ADD_DONE_COMPLETE;

  constructor(public payload: {timer: Timer}) {}
}

export class DeleteDoneRequested implements Action {
  readonly type = ActionTypes.DELETE_DONE_REQUESTED;

  constructor(public payload: {timerId: string}) {}
}

export class DeleteDoneComplete implements Action {
  readonly type = ActionTypes.DELETE_DONE_COMPLETE;

  constructor(public payload: {timerId: string}) {}
}



export type Actions =
  SingleDoneRequested |
  SingleDoneLoaded |
  AllDoneRequested |
  LoadErrorDetected |
  AllDoneLoaded |
  UpdateDoneRequested |
  UpdateDoneComplete |
  AddDoneRequested |
  AddDoneComplete |
  DeleteDoneRequested |
  DeleteDoneComplete;
