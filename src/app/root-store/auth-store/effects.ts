import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as authFeatureActions from './actions';
import * as userFeatureActions from '../user-store/actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RootStoreState } from '..';
import { StoreUserDataType } from 'src/app/shared/models/store-user-data-type.model';
import { AuthenticateUserType } from 'src/app/shared/models/authenticate-user-type.model';

@Injectable()
export class AuthStoreEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  registerUserRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.RegisterUserRequested>(
      authFeatureActions.ActionTypes.REGISTER_USER_REQUESTED
    ),
    switchMap(action =>
      this.authService.registerUser(action.payload.authData)
        .pipe(
          // Store registered user data in the database (not just the user records)
          tap(response => {
            this.store$.dispatch(
              new userFeatureActions.StoreUserDataRequested(
                {userData: response.userData, userId: response.userId, requestType: StoreUserDataType.REGISTER_USER}
              )
            );
          }),
          map(response => new authFeatureActions.RegisterUserComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  authenticationRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.AuthenticationRequested>(
      authFeatureActions.ActionTypes.AUTHENTICATION_REQUESTED
    ),
    switchMap(action => {

      // If email auth, retrieve additional user data from FB
      if (action.payload.requestType === AuthenticateUserType.EMAIL_AUTH) {
        return this.authService.login(action.payload.authData)
          .pipe(
            // Load user data into the store
            tap(fbUser =>
              // If email login, payload is a firebaseUser, but all we need is the uid
              this.store$.dispatch(new userFeatureActions.UserDataRequested({userId: fbUser.uid}))
            ),
            map(fbUser => new authFeatureActions.AuthenticationComplete()),
            catchError(error => {
              return of(new authFeatureActions.LoadErrorDetected({ error }));
            })
          );
      }

      // If Google login, treat like user registration
      if (action.payload.requestType === AuthenticateUserType.GOOGLE_AUTH) {
        return this.authService.googleLogin()
          .pipe(
            tap(appUser => {
              // Store (or overwrite) user data
              // User data fetched in User Store after the storing process is complete
              this.store$.dispatch(
                new userFeatureActions.StoreUserDataRequested(
                  {userData: appUser, userId: appUser.id, requestType: StoreUserDataType.GOOGLE_LOGIN}
                )
              );
            }),
            map(fbUser => new authFeatureActions.AuthenticationComplete()),
            catchError(error => {
              return of(new authFeatureActions.LoadErrorDetected({ error }));
            })
          );
      }

    })
  );

  @Effect()
  updateEmailRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.UpdateEmailRequested>(
      authFeatureActions.ActionTypes.UPDATE_EMAIL_REQUESTED
    ),
    switchMap(action =>
      this.authService.updateEmail(
        action.payload.appUser,
        action.payload.password,
        action.payload.newEmail
        )
        .pipe(
          // Update email in the main database (separate from the User database)
          tap(response => {
            return this.store$.dispatch(
              new userFeatureActions.StoreUserDataRequested(
                {userData: response.userData, userId: response.userId, requestType: StoreUserDataType.EMAIL_UPDATE}
              )
            );
          }),
          map(response => new authFeatureActions.UpdateEmailComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  updatePasswordRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.UpdatePasswordRequested>(
      authFeatureActions.ActionTypes.UPDATE_PASSWORD_REQUESTED
    ),
    switchMap(action =>
      this.authService.updatePassword(
        action.payload.appUser,
        action.payload.oldPassword,
        action.payload.newPassword
        )
        .pipe(
          map(response => new authFeatureActions.UpdatePasswordComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  resetPasswordRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.ResetPasswordRequested>(
      authFeatureActions.ActionTypes.RESET_PASSWORD_REQUESTED
    ),
    switchMap(action =>
      this.authService.sendResetPasswordEmail(
        action.payload.email
        )
        .pipe(
          map(response => new authFeatureActions.ResetPasswordComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );
}
