import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, UserStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter<void>();

  appUser$: Observable<AppUser>;
  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  constructor(
    private store$: Store<RootStoreState.State>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );
  }

  private onCloseSidenav() {
    this.closeSidenav.emit();
  }

  private onLogout() {
    this.authService.logout();
    this.onCloseSidenav();
  }

}
