import { Component, OnInit } from '@angular/core';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';

@Component({
  selector: 'app-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit {
  timers$: Observable<Timer[]>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
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
