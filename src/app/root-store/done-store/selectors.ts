import { State } from './state';
import * as fromDone from './reducer';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { Timer } from 'src/app/timers/models/timer.model';

export const getError = (state: State): any => state.error;
export const getIsLoading = (state: State): boolean => state.isLoading;
export const getDoneLoaded = (state: State): boolean => state.doneLoaded;
export const getProcessingClientRequest = (state: State): boolean => state.processingClientRequest;

export const selectDoneState: MemoizedSelector<object, State>
= createFeatureSelector<State>('done');

export const selectAllDone: (state: object) => Timer[] = createSelector(
  selectDoneState,
  fromDone.selectAll
);

export const selectDoneById: (timerId: string) => MemoizedSelector<object, Timer>
= (timerId: string) => createSelector(
  selectDoneState,
  doneState => doneState.entities[timerId]
);

export const selectDoneError: MemoizedSelector<object, any> = createSelector(
  selectDoneState,
  getError
);

export const selectDoneIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectDoneState, getIsLoading);

export const selectDoneLoaded: MemoizedSelector<object, boolean>
= createSelector(selectDoneState, getDoneLoaded);

export const selectProcessingClientRequest: MemoizedSelector<object, boolean>
= createSelector(selectDoneState, getProcessingClientRequest);
