import { AuthStoreState } from './auth-store';
import { TimerStoreState } from './timer-store';

export interface State {
  auth: AuthStoreState.State;
  timers: TimerStoreState.State;
}
