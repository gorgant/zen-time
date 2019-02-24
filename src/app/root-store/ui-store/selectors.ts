import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';

const getIsOnline = (state: State): boolean => state.isOnline;

export const selectUiState: MemoizedSelector<object, State>
= createFeatureSelector<State>('ui');

export const selectIsOnline: MemoizedSelector<object, boolean>
= createSelector(
  selectUiState,
  getIsOnline
);
