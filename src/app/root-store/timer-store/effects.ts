import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as featureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
  ) { }

  @Effect()
  singleTimerRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.SingleTimerRequested>(
      featureActions.ActionTypes.SINGLE_TIMER_REQUESTED
    ),
    mergeMap(action =>
      this.timerService.fetchSingleTimer(action.payload.timerId)
        .pipe(
          map(timer => new featureActions.SingleTimerLoaded({timer})),
          catchError(error =>
            of(new featureActions.LoadErrorDetected({ error }))
          )
        )
    )
  );

  @Effect()
  allTimersRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllTimersRequested>(
      featureActions.ActionTypes.ALL_TIMERS_REQUESTED
    ),
    switchMap(action =>
      this.timerService.fetchAllTimers()
        .pipe(
          map(timers => new featureActions.AllTimersLoaded({items: timers})),
          catchError(error =>
            of(new featureActions.LoadErrorDetected({ error }))
          )
        )
    )
  );
}
