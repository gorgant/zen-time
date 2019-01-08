import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions } from 'src/app/root-store';
import { TimerService } from '../../services/timer.service';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit {

  timer$: Observable<Timer>;

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
  }

}
