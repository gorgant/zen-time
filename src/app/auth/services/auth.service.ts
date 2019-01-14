import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from '../models/auth-data.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { RootStoreState, AuthStoreActions, UserStoreActions } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { AppUser } from 'src/app/shared/models/app-user.model';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UiService,
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
    // private userService: UserService
  ) { }

  initAuthListener(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authSuccess(user);
      } else {
        this.postLogoutActions();
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      const appUser: AppUser = {
        displayName: authData.name,
        email: authData.email,
      };
      const userId = creds.user.uid;
      this.store$.dispatch(new UserStoreActions.StoreUserDataRequested({userData: appUser, userId}));
      // this.userService.storeUserData(appUser, userId);
      // this.store$.dispatch(new AuthStoreActions.SetUser({user: appUser}));
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
    });
  }

  login(authData: AuthData): void {
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      // Actions managed in the authSuccess via AuthListener
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
    });
  }

  logout(): void {
    // Note the postLogoutActions as well, triggered by authstate change
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  updateEmail(appUser: AppUser, password: string, newEmail: string) {

    const credentials = this.getUserCredentials(appUser.email, password);

    this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(success => {
        this.afAuth.auth.currentUser.updateEmail(newEmail)
          .then(data => {
            const newUserData: AppUser = {
              ...appUser,
              email: newEmail
            };
            this.store$.dispatch(new UserStoreActions.StoreUserDataRequested({userData: newUserData, userId: appUser.id}));
            this.uiService.showSnackBar(`Email successfully updated: ${newEmail}`, null, 3000);
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
          });
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
      });
  }

  updatePassword(appUser: AppUser, oldPassword: string, newPassword: string) {
    const credentials = this.getUserCredentials(appUser.email, oldPassword);

    this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(success => {
        this.afAuth.auth.currentUser.updatePassword(newPassword)
          .then(data => {
            this.uiService.showSnackBar(`Password successfully updated`, null, 3000);
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
          });
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
      });
  }

  private getUserCredentials(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    return credentials;
  }

  private authSuccess(user: firebase.User): void {
    this.store$.dispatch(new UserStoreActions.UserDataRequested({userId: user.uid}));
    this.store$.dispatch(new AuthStoreActions.SetAuthenticated());
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (returnUrl && returnUrl !== '/') {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate(['']);
    }
  }

  private postLogoutActions(): void {
    this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
  }
}
