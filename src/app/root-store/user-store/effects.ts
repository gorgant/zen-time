import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as featureActions from './actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { RootStoreState } from '..';
import { AppUser } from 'src/app/shared/models/app-user.model';

@Injectable()
export class UserStoreEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private uiService: UiService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  userDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UserDataRequested>(
      featureActions.ActionTypes.USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.fetchUserData(action.payload.userId)
        .pipe(
          map(user => new featureActions.UserDataLoaded({userData: user})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  storeUserDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.StoreUserDataRequested>(
      featureActions.ActionTypes.STORE_USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.storeUserData(action.payload.userData, action.payload.userId, action.payload.userRegistration)
        .pipe(
          // // When user data is stored in the database, update it in the store as well for realtime update to UI
          // tap(appUser => this.store$.dispatch(new featureActions.UserDataRequested({userId: appUser.id}))),
          map(appUser => new featureActions.StoreUserDataComplete()),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  updateProfileImageRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateProfileImageRequested>(
      featureActions.ActionTypes.UPDATE_PROFILE_IMAGE_REQUESTED
    ),
    switchMap(action =>
      this.userService.uploadProfileImage(action.payload.imageFile, action.payload.user)
        .pipe(
          tap(imageUrl => {
            const updatedAppUser: AppUser = {
              ...action.payload.user,
              avatarUrl: imageUrl
            };
            this.store$.dispatch(new featureActions.StoreUserDataRequested({userData: updatedAppUser, userId: updatedAppUser.id}));
          }),
          map(imageUrl => new featureActions.StoreUserDataComplete()),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );
}
