import {
  MemoizedSelector,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import { State } from './state';

const getIsAuth = (state: State): boolean => state.isAuthenticated;

export const selectAuthState: MemoizedSelector<object, State>
= createFeatureSelector<State>('auth');

export const selectIsAuth: MemoizedSelector<object, boolean>
= createSelector(
  selectAuthState,
  getIsAuth
);
