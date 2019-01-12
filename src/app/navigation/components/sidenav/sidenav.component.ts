import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';

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
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );
  }

  private onCloseSidenav() {
    this.closeSidenav.emit();
  }

}
