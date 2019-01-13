import { AuthStoreState } from './auth-store';
import { TimerStoreState } from './timer-store';
import { DoneStoreState } from './done-store';

export interface State {
  auth: AuthStoreState.State;
  timers: TimerStoreState.State;
  done: DoneStoreState.State;
}
