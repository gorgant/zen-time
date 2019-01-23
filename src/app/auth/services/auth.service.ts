import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from '../models/auth-data.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { AppUser } from 'src/app/shared/models/app-user.model';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authStatus = new Subject<string>();
  private ngUnsubscribe$: Subject<void> = new Subject();

  // Cannot inject store$ here otherwise circular dependencies
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UiService,
    private route: ActivatedRoute,
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

  registerUser(authData: AuthData): Observable<{userData: AppUser, userId: string}> {
    const authResponse = from(this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      const appUser: AppUser = {
        displayName: authData.name,
        email: authData.email,
      };
      const userId = creds.user.uid;
      return {userData: appUser, userId: userId};
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return error;
    }));

    return from(authResponse);
  }

  login(authData: AuthData): Observable<string> {
    const authResponse = this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      const userId = creds.user.uid;
      return userId;
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return error;
    });

    return from(authResponse);
  }

  logout(): void {
    // Note the postLogoutActions as well, triggered by authstate change
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  updateEmail(appUser: AppUser, password: string, newEmail: string): Observable<{userData: AppUser, userId: string}> {

    const credentials = this.getUserCredentials(appUser.email, password);

    const authResponse = this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(userCreds => {
        const updateResponse = this.afAuth.auth.currentUser.updateEmail(newEmail)
          .then(empty => {
            const newUserData: AppUser = {
              ...appUser,
              email: newEmail
            };
            this.uiService.showSnackBar(`Email successfully updated: ${newEmail}`, null, 3000);
            return {userData: newUserData, userId: appUser.id};
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
            return error;
          });
        return updateResponse;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
        return error;
      });

      return from(authResponse);
  }

  updatePassword(appUser: AppUser, oldPassword: string, newPassword: string): Observable<string> {
    const credentials = this.getUserCredentials(appUser.email, oldPassword);

    const authResponse = this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(userCreds => {
        const updateResponse = this.afAuth.auth.currentUser.updatePassword(newPassword)
          .then(empty => {
            this.uiService.showSnackBar(`Password successfully updated`, null, 3000);
            return empty;
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
            return error;
          });
        return updateResponse;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
        return error;
      });

      return from(authResponse);
  }

  sendResetPasswordEmail(email: string): Observable<string> {
    const authResponse = this.afAuth.auth.sendPasswordResetEmail(email)
      .then(empty => {
        this.uiService.showSnackBar(
          `Password reset link sent to ${email}. Please check your email for instructions.`, null, 5000
        );
        return empty;
      } )
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return error;
      });

    return from(authResponse);
  }

  get unsubTrigger$() {
    return this.ngUnsubscribe$;
  }

  private getUserCredentials(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    return credentials;
  }

  private authSuccess(user: firebase.User): void {
    this.authStatus.next(user.uid);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (returnUrl && returnUrl !== '/') {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate(['']);
    }
  }

  private postLogoutActions(): void {
    this.authStatus.next(null);
  }
}
