import {
  MemoizedSelector,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import { State } from './state';
import { AppUser } from 'src/app/shared/models/app-user.model';

const getIsAuth = (state: State): boolean => state.isAuthenticated;
const getUser = (state: State): any => state.user;

export const selectAuthState: MemoizedSelector<object, State>
= createFeatureSelector<State>('auth');

export const selectIsAuth: MemoizedSelector<object, boolean>
= createSelector(
  selectAuthState,
  getIsAuth
);

export const selectAppUser: MemoizedSelector<object, AppUser> = createSelector(
  selectAuthState,
  getUser
);
