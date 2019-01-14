import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as featureActions from './actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable()
export class UserStoreEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private uiService: UiService,
    // private store$: Store<RootStoreState.State>,
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
      this.userService.storeUserData(action.payload.userData, action.payload.userId)
        .pipe(
          map(emptyResponse => new featureActions.StoreUserDataComplete()),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
