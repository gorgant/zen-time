import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { imageUrls } from 'src/app/shared/assets/imageUrls';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  loading$: Observable<boolean>;
  appUser$: Observable<AppUser>;
  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );

    this.loading$ = this.store$.select(
      UserStoreSelectors.selectUserIsLoading
    );
  }

}
