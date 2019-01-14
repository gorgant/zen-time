import { Component, OnInit } from '@angular/core';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, UserStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  appUser$: Observable<AppUser>;
  loading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
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

  onLogout() {
    this.authService.logout();
  }

}
