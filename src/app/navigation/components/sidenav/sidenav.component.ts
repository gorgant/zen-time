import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  appUser$: Observable<AppUser>;
  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  constructor(
    private store$: Store<RootStoreState.State>,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );
  }

  onToggleSideNav() {
    this.uiService.dispatchSideNavClick();
  }

  onLogout() {
    this.authService.logout();
    this.uiService.dispatchSideNavClick();
  }

}
