import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as featureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private uiService: UiService
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
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          }
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
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  updateTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateTimerRequested>(
      featureActions.ActionTypes.UPDATE_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.saveTimer(action.payload.timer).pipe(
      map(timer => {
        const timerUp: Update<Timer> = {
          id: timer.id,
          changes: timer
        };
        return new featureActions.UpdateTimerComplete({timer: timerUp});
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  addTimerEffect$ = this.actions$.pipe(
    ofType<featureActions.AddTimerRequested>(
      featureActions.ActionTypes.ADD_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.createTimer(action.payload.timer).pipe(
      map(timerWithId => new featureActions.AddTimerComplete({timer: timerWithId})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteTimerEffect$ = this.actions$.pipe(
    ofType<featureActions.DeleteTimerRequested>(
      featureActions.ActionTypes.DELETE_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteTimer(action.payload.timerId).pipe(
      map(timerId => new featureActions.DeleteTimerComplete({timerId: timerId})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );
}
