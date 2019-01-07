import { Component, OnInit } from '@angular/core';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions, AuthStoreSelectors } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AppUser } from 'src/app/shared/models/app-user.model';

@Component({
  selector: 'app-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  appUser$: Observable<AppUser>;

  timers$: Observable<Timer[]>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    this.timers$ = this.store$.select(
      TimerStoreSelectors.selectAllTimers
    );

    this.error$ = this.store$.select(
      TimerStoreSelectors.selectTimerError
    );

    this.isLoading$ = this.store$.select(
      TimerStoreSelectors.selectTimerIsLoading
    );

    this.store$.dispatch(
      new TimerStoreActions.AllTimersRequested()
    );
  }

}
