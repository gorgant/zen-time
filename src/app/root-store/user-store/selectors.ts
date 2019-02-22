import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppUser } from 'src/app/shared/models/app-user.model';

export const getError = (state: State): any => state.error;
export const getUserIsLoading = (state: State): boolean => state.isLoading;
export const getProfileImageIsLoading = (state: State): boolean => state.profileImageLoading;
export const getUserLoaded = (state: State): boolean => state.userLoaded;
export const getUser = (state: State): AppUser => state.user;
export const getPushPermissionSet = (state: State): boolean => state.pushPermissionSet;

export const selectUserState: MemoizedSelector<object, State>
= createFeatureSelector<State>('user');

export const selectAppUser: MemoizedSelector<object, AppUser> = createSelector(
  selectUserState,
  getUser
);

export const selectUserIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserIsLoading);

export const selectProfileImageIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getProfileImageIsLoading);

export const selectUserLoaded: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserLoaded);

export const selectPushPermissionSet: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getPushPermissionSet);
