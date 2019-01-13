import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UiService } from 'src/app/shared/services/ui.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as featureActions from './actions';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';

@Injectable()
export class DoneStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private uiService: UiService
  ) { }

  @Effect()
  singleDoneRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.SingleDoneRequested>(
      featureActions.ActionTypes.SINGLE_DONE_REQUESTED
    ),
    mergeMap(action =>
      this.timerService.fetchSingleDone(action.payload.timerId)
        .pipe(
          map(timer => new featureActions.SingleDoneLoaded({timer})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  allDoneRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllDoneRequested>(
      featureActions.ActionTypes.ALL_DONE_REQUESTED
    ),
    switchMap(action =>
      this.timerService.fetchAllDone()
        .pipe(
          map(timers => new featureActions.AllDoneLoaded({timers: timers})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new featureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  updateDoneEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateDoneRequested>(
      featureActions.ActionTypes.UPDATE_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.updateDone(action.payload.timer).pipe(
      map(timer => {
        const timerUp: Update<Timer> = {
          id: timer.id,
          changes: timer
        };
        return new featureActions.UpdateDoneComplete({timer: timerUp});
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  addDoneEffect$ = this.actions$.pipe(
    ofType<featureActions.AddDoneRequested>(
      featureActions.ActionTypes.ADD_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.createDone(action.payload.timer).pipe(
      map(timerWithId => new featureActions.AddDoneComplete({timer: timerWithId})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteDoneEffect$ = this.actions$.pipe(
    ofType<featureActions.DeleteDoneRequested>(
      featureActions.ActionTypes.DELETE_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteDone(action.payload.timerId).pipe(
      map(timerId => new featureActions.DeleteDoneComplete({timerId: timerId})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new featureActions.LoadErrorDetected({ error }));
      })
    )),
  );
}
