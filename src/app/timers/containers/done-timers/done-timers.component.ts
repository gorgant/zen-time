import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, DoneStoreSelectors, DoneStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-done-timers',
  templateUrl: './done-timers.component.html',
  styleUrls: ['./done-timers.component.scss']
})
export class DoneTimersComponent implements OnInit {

  done$: Observable<Timer[]>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.done$ = this.store$.select(
      DoneStoreSelectors.selectAllDone
    ).pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectAppUser),
        this.store$.select(DoneStoreSelectors.selectDoneLoaded),
      ),
      map(([timers, appUser, timersLoaded]) => {
        // Fetch timer if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new DoneStoreActions.AllDoneRequested({userId: appUser.id})
          );
        }
        return timers;
      })
    );

    this.error$ = this.store$.select(
      DoneStoreSelectors.selectDoneError
    );

    this.isLoading$ = this.store$.select(
      DoneStoreSelectors.selectDoneIsLoading
    );
  }

}
