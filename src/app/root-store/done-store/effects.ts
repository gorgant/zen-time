import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as doneFeatureActions from './actions';
import * as timerFeatureActions from '../timer-store/actions';
import * as undoFeatureActions from '../undo-store/actions';
import { mergeMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { RootStoreState } from '..';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

@Injectable()
export class DoneStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
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
            return of(new doneFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  addDoneEffect$ = this.actions$.pipe(
    ofType<doneFeatureActions.AddDoneRequested>(
      doneFeatureActions.ActionTypes.ADD_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.createDone(action.payload.timer, action.payload.undoAction).pipe(
      tap(completedTimer => {
        if (!action.payload.undoAction) {
          this.store$.dispatch(new timerFeatureActions.DeleteTimerRequested({timer: action.payload.timer, markDone: true}));
        }
      }),
      map(completedTimer => new doneFeatureActions.AddDoneComplete({timer: completedTimer})),
      catchError(error => {
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteDoneEffect$ = this.actions$.pipe(
    ofType<doneFeatureActions.DeleteDoneRequested>(
      doneFeatureActions.ActionTypes.DELETE_DONE_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteDone(action.payload.timer, action.payload.undoAction).pipe(
      map(timerId => {
        return new doneFeatureActions.DeleteDoneComplete({timerId});
      }),
      tap(() => {
        if (!action.payload.undoAction) {
          const actionId = action.payload.timer.id;
          const undoableAction: UndoableAction = {
            payload: action.payload.timer,
            actionId: actionId,
            actionType: doneFeatureActions.ActionTypes.DELETE_DONE_REQUESTED
          };
          this.store$.dispatch(new undoFeatureActions.StashUndoableAction({undoableAction}));
        }
      }),
      catchError(error => {
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );
}
