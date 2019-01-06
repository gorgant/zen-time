import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from '../models/auth-data.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UiService
  ) { }

  initAuthListener(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authSuccess();
      } else {
        this.postLogoutActions();
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.authSuccess();
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
    });
  }

  login(authData: AuthData): void {
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.authSuccess();
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
    });
  }

  logout(): void {
    // Note the postLogoutActions as well, triggered by authstate change
    this.afAuth.auth.signOut();
  }

  private authSuccess(): void {
    this.router.navigate(['']);
  }

  private postLogoutActions(): void {
    this.router.navigate(['/login']);
  }
}
