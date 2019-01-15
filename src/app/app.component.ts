import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions, UserStoreActions, UserStoreSelectors } from './root-store';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zen-time';

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
  ) {}

  ngOnInit() {
    this.authService.initAuthListener();
    this.authService.authStatus
    .pipe(
      withLatestFrom(this.store$.select(UserStoreSelectors.selectUserIsLoading))
    )
    .subscribe(([userId, userIsLoading]) => {
      // Prevents this from firing on a standard login/registration (b/c it'll fire elsewhere)
      if (userId && !userIsLoading) {
        this.store$.dispatch( new AuthStoreActions.AuthenticationComplete());
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (!userIsLoading) {
        // Prevents this from firing when first logging in
        this.store$.dispatch( new AuthStoreActions.SetUnauthenticated);
      }
    });
  }
}
