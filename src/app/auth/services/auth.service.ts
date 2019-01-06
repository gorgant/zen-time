import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from '../models/auth-data.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/shared/services/user.service';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { take } from 'rxjs/operators';

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
    private userService: UserService
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
      this.userService.storeUserData(appUser, userId);
      this.store$.dispatch(new AuthStoreActions.SetUser({user: appUser}));
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
    this.afAuth.auth.signOut();
  }

  private authSuccess(user: firebase.User): void {
    this.userService.fetchUserData(user.uid)
      .pipe(
        take(1)
      ).subscribe( appUser => {
        this.store$.dispatch(new AuthStoreActions.SetUser({user: appUser}));
      });
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
    this.router.navigate(['/login']);
  }
}
