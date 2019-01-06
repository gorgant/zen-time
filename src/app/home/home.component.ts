import { Component, OnInit } from '@angular/core';
import { imageUrls } from '../shared/assets/imageUrls';
import { Observable } from 'rxjs';
import { AppUser } from '../shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from '../root-store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  appUser$: Observable<AppUser>;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );
  }

}
