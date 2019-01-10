import { Action } from '@ngrx/store';
import { Timer } from 'src/app/timers/models/timer.model';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  SINGLE_TIMER_REQUESTED = '[Timers] Single Timer Requested',
  SINGLE_TIMER_LOADED = '[Timers] Single Timer Loaded',
  ALL_TIMERS_REQUESTED = '[Timers] All Timers Requested',
  ALL_TIMERS_LOADED = '[Timers] All Timers Loaded',
  TIMER_LOAD_FAILURE = '[Timers] Load Failure',
  UPDATE_TIMER_REQUESTED = '[Timers] Timer Update Requested',
  UPDATE_TIMER_COMPLETE = '[Timers] Timer Updated',
  ADD_TIMER_REQUESTED = '[Timers] Save Timer Requested',
  ADD_TIMER_COMPLETE = '[Timers] Timer Saved',
  DELETE_TIMER_REQUESTED = '[Timers] Timer Delete Requested ',
  DELETE_TIMER_COMPLETE = '[Timers] Timer Deleted',
}

export class SingleTimerRequested implements Action {
  readonly type = ActionTypes.SINGLE_TIMER_REQUESTED;
  constructor (public payload: { timerId: string }) {}
}

export class SingleTimerLoaded implements Action {
  readonly type = ActionTypes.SINGLE_TIMER_LOADED;
  constructor (public payload: { timer: Timer }) {}
}

export class AllTimersRequested implements Action {
  readonly type = ActionTypes.ALL_TIMERS_REQUESTED;
}

export class AllTimersLoaded implements Action {
  readonly type = ActionTypes.ALL_TIMERS_LOADED;
  constructor(public payload: { items: Timer[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.TIMER_LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UpdateTimerRequested implements Action {
  readonly type = ActionTypes.UPDATE_TIMER_REQUESTED;

  constructor(public payload: {timer: Timer}) {}
}

export class UpdateTimerComplete implements Action {
  readonly type = ActionTypes.UPDATE_TIMER_COMPLETE;

  constructor(public payload: {timer: Update<Timer>}) {}
}

export class AddTimerRequested implements Action {
  readonly type = ActionTypes.ADD_TIMER_REQUESTED;

  constructor(public payload: {timer: Timer}) {}
}

export class AddTimerComplete implements Action {
  readonly type = ActionTypes.ADD_TIMER_COMPLETE;

  constructor(public payload: {timer: Timer}) {}
}

export class DeleteTimerRequested implements Action {
  readonly type = ActionTypes.DELETE_TIMER_REQUESTED;

  constructor(public payload: {timerId: string}) {}
}

export class DeleteTimerComplete implements Action {
  readonly type = ActionTypes.DELETE_TIMER_COMPLETE;

  constructor(public payload: {timerId: string}) {}
}



export type Actions =
  SingleTimerRequested |
  SingleTimerLoaded |
  AllTimersRequested |
  LoadErrorDetected |
  AllTimersLoaded |
  UpdateTimerRequested |
  UpdateTimerComplete |
  AddTimerRequested |
  AddTimerComplete |
  DeleteTimerRequested |
  DeleteTimerComplete;
