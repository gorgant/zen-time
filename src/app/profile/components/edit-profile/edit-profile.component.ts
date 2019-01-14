import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditNameDialogueComponent } from '../edit-name-dialogue/edit-name-dialogue.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  loading$: Observable<boolean>;
  appUser$: Observable<AppUser>;
  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  @ViewChild('matButton') matButton;

  constructor(
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
  }

  onEditName() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    // Must be 'matButton' and #matButton
    this.matButton._elementRef.nativeElement.blur();

    this.appUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditNameDialogueComponent, dialogConfig);
      });
  }

}
