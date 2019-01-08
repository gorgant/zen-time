import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  timer$: Observable<Timer>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    const timerId: string = this.route.snapshot.params['id'];

    this.timer$ = this.store$.select(
      TimerStoreSelectors.selectTimerById(timerId)
    ).pipe(
      withLatestFrom(this.store$.select(TimerStoreSelectors.selectTimersLoaded)),
      map(([timer, timersLoaded]) => {
        // Fetch timers if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new TimerStoreActions.SingleTimerRequested({timerId})
          );
        }
        return timer;
      })
    );

    this.error$ = this.store$.select(
      TimerStoreSelectors.selectTimerError
    );

    this.isLoading$ = this.store$.select(
      TimerStoreSelectors.selectTimerIsLoading
    );
  }



}
