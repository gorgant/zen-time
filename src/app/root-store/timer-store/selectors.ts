import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { Timer } from 'src/app/timers/models/timer.model';
import * as fromTimers from './reducer';

export const getError = (state: State): any => state.error;

export const getIsLoading = (state: State): boolean => state.isLoading;

export const selectTimerState: MemoizedSelector<object, State>
= createFeatureSelector<State>('timer');

export const selectAllTimers: (state: object) => Timer[] = createSelector(
  selectTimerState,
  fromTimers.selectAll
);

export const selectTimerById: (timerId: string) => MemoizedSelector<object, Timer>
= (timerId: string) => createSelector(
  selectTimerState,
  timersState => timersState.entities[timerId]
);

export const selectTimerError: MemoizedSelector<object, any> = createSelector(
  selectTimerState,
  getError
);

export const selectTimerIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectTimerState, getIsLoading);