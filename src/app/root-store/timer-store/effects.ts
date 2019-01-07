import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as featureActions from './actions';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions
  ) { }

  @Effect()
  loadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllTimersRequested>(
      featureActions.ActionTypes.ALL_TIMERS_REQUESTED
    ),
    switchMap(action =>
      this.timerService.fetchTimers()
        .pipe(
          map(timers => new featureActions.AllTimersLoaded({items: timers})),
          catchError(error =>
            of(new featureActions.LoadErrorDetected({ error }))
          )
        )
     )
  );
}
