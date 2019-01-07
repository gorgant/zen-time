import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as featureActions from './actions';
import * as featureSelectors from './selectors';
import { startWith, switchMap, map, catchError, withLatestFrom, filter, take } from 'rxjs/operators';
import { RootStoreState } from '..';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  loadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllTimersRequested>(
      featureActions.ActionTypes.ALL_TIMERS_REQUESTED
    ),
    withLatestFrom(this.store$.select(featureSelectors.selectTimersLoaded)),
    switchMap(([action, timersLoaded]) => {
      // Only load timers if they haven't been loaded yet
      if (!timersLoaded) {
        return this.timerService.fetchTimers()
          .pipe(
            map(timers => new featureActions.AllTimersLoaded({items: timers})),
            catchError(error =>
              of(new featureActions.LoadErrorDetected({ error }))
            )
          );
      } else {
        return this.store$.select(featureSelectors.selectAllTimers)
          .pipe(
            take(1),
            map(timers => new featureActions.AllTimersLoaded({items: timers})),
            catchError(error =>
              of(new featureActions.LoadErrorDetected({ error }))
            )
          );
      }
    }
     )
  );
}
