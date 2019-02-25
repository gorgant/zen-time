import { Component, OnInit, ViewChild } from '@angular/core';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, AuthStoreActions, UiStoreSelectors } from 'src/app/root-store';
import { take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditPasswordDialogueComponent } from '../edit-password-dialogue/edit-password-dialogue.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  appUser$: Observable<AppUser>;
  loading$: Observable<boolean>;
  @ViewChild('matButton') matButton;
  isOnline$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );

    this.loading$ = this.store$.select(
      UserStoreSelectors.selectUserIsLoading
    );

    this.isOnline$ = this.store$.select(UiStoreSelectors.selectIsOnline);

  }

  onEditPassword() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton._elementRef.nativeElement.blur();

    this.appUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditPasswordDialogueComponent, dialogConfig);
      });

  }

  onLogout() {
    this.authService.logout();
    this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
  }

}
