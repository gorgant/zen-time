import { Action } from '@ngrx/store';
import { Timer } from 'src/app/timers/models/timer.model';

export enum ActionTypes {
  SINGLE_TIMER_REQUESTED = '[Timers] Single Timer Requested',
  SINGLE_TIMER_LOADED = '[Timers] Single Timer Loaded',
  ALL_TIMERS_REQUESTED = '[Timers] All Timers Requested',
  ALL_TIMERS_LOADED = '[Timers] All Timers Loaded',
  TIMER_LOAD_FAILURE = '[Timers] Load Failure',
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



export type Actions =
  SingleTimerRequested |
  SingleTimerLoaded |
  AllTimersRequested |
  LoadErrorDetected |
  AllTimersLoaded;
