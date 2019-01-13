import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UiService } from 'src/app/shared/services/ui.service';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as doneFeatureActions from './actions';
import * as timerFeatureActions from '../timer-store/actions';
import { mergeMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';
import { RootStoreState } from '..';

@Injectable()
export class DoneStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private uiService: UiService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  singleDoneRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<doneFeatureActions.SingleDoneRequested>(
      doneFeatureActions.ActionTypes.SINGLE_DONE_REQUESTED
    ),
    mergeMap(action =>
      this.timerService.fetchSingleDone(action.payload.timerId)
        .pipe(
          map(timer => new doneFeatureActions.SingleDoneLoaded({timer})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new doneFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  allDoneRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<doneFeatureActions.AllDoneRequested>(
      doneFeatureActions.ActionTypes.ALL_DONE_REQUESTED
    ),
    switchMap(action =>
      this.timerService.fetchAllDone()
        .pipe(
          map(timers => new doneFeatureActions.AllDoneLoaded({timers: timers})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new doneFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  updateDoneEffect$: Observable<Action> = this.actions$.pipe(
    ofType<doneFeatureActions.UpdateDoneRequested>(
      doneFeatureActions.ActionTypes.UPDATE_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.updateDone(action.payload.timer).pipe(
      map(timer => {
        const timerUp: Update<Timer> = {
          id: timer.id,
          changes: timer
        };
        return new doneFeatureActions.UpdateDoneComplete({timer: timerUp});
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  addDoneEffect$ = this.actions$.pipe(
    ofType<doneFeatureActions.AddDoneRequested>(
      doneFeatureActions.ActionTypes.ADD_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.createDone(action.payload.timer).pipe(
      tap(completedTimer => {
        if (completedTimer) {
          console.log('Completed timer detected, deleting active one');
          this.store$.dispatch(new timerFeatureActions.DeleteTimerRequested({timerId: action.payload.timer.id}));
        } else {
          console.log('Error creating completed timer');
        }
      }),
      map(completedTimer => new doneFeatureActions.AddDoneComplete({timer: completedTimer})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteDoneEffect$ = this.actions$.pipe(
    ofType<doneFeatureActions.DeleteDoneRequested>(
      doneFeatureActions.ActionTypes.DELETE_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteDone(action.payload.timerId).pipe(
      map(timerId => new doneFeatureActions.DeleteDoneComplete({timerId: timerId})),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );
}
