import { AuthStoreState } from './auth-store';
import { TimerStoreState } from './timer-store';
import { DoneStoreState } from './done-store';
import { UserStoreState } from './user-store';
import { UndoStoreState } from './undo-store';
import { UiStoreState } from '.';

export interface State {
  auth: AuthStoreState.State;
  timers: TimerStoreState.State;
  done: DoneStoreState.State;
  user: UserStoreState.State;
  undo: UndoStoreState.State;
  ui: UiStoreState.State;
}
