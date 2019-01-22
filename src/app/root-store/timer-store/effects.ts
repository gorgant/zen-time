import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UiService } from 'src/app/shared/services/ui.service';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as timerFeatureActions from './actions';
import * as doneFeatureActions from '../done-store/actions';
import * as undoFeatureActions from '../undo-store/actions';
import * as timerFeatureSelectors from './selectors';
import { switchMap, map, catchError, mergeMap, tap, take } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';
import { RootStoreState } from '..';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private uiService: UiService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  singleTimerRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.SingleTimerRequested>(
      timerFeatureActions.ActionTypes.SINGLE_TIMER_REQUESTED
    ),
    mergeMap(action =>
      this.timerService.fetchSingleTimer(action.payload.timerId)
        .pipe(
          map(timer => new timerFeatureActions.SingleTimerLoaded({timer})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new timerFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  allTimersRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.AllTimersRequested>(
      timerFeatureActions.ActionTypes.ALL_TIMERS_REQUESTED
    ),
    switchMap(action =>
      this.timerService.fetchAllTimers()
        .pipe(
          map(timers => new timerFeatureActions.AllTimersLoaded({timers: timers})),
          catchError(error => {
            this.uiService.showSnackBar(error, null, 5000);
            return of(new timerFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect()
  updateTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.UpdateTimerRequested>(
      timerFeatureActions.ActionTypes.UPDATE_TIMER_REQUESTED
    ),
    // Capture original timer data for the undo store before updating timer
    tap((action) => {
      if (!action.payload.undoAction) {
        this.store$.select(timerFeatureSelectors.selectTimerById(action.payload.timer.id))
          .pipe(take(1))
          .subscribe(previousTimer => {
            const actionId = previousTimer.id;
            const undoableAction: UndoableAction = {
              payload: previousTimer,
              actionId: actionId,
              actionType: timerFeatureActions.ActionTypes.UPDATE_TIMER_REQUESTED
            };
            this.store$.dispatch(new undoFeatureActions.StashUndoableAction({undoableAction}));
          });
      }
    }),
    mergeMap(action => this.timerService.updateTimer(action.payload.timer, action.payload.undoAction).pipe(
      map(timer => {
        const timerUp: Update<Timer> = {
          id: timer.id,
          changes: timer
        };
        return new timerFeatureActions.UpdateTimerComplete({timer: timerUp});
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  addTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.AddTimerRequested>(
      timerFeatureActions.ActionTypes.ADD_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.createTimer(action.payload.timer, action.payload.undoAction).pipe(
      map(timerWithId => {
        return new timerFeatureActions.AddTimerComplete({timer: timerWithId});
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.DeleteTimerRequested>(
      timerFeatureActions.ActionTypes.DELETE_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteTimer(action.payload.timer, action.payload.markDone).pipe(
      map(timerId => new timerFeatureActions.DeleteTimerComplete({timerId})),
      tap(() => {
        const actionId = action.payload.timer.id;
        const undoableAction: UndoableAction = {
          payload: action.payload.timer,
          actionId: actionId,
          actionType: timerFeatureActions.ActionTypes.DELETE_TIMER_REQUESTED
        };
        // Only stash the delete action if this isn't a mark-done request
        if (!action.payload.markDone) {
          this.store$.dispatch(new undoFeatureActions.StashUndoableAction({undoableAction}));
        }
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect({dispatch: false})
  markTimerDoneEffect$ = this.actions$.pipe(
    ofType<timerFeatureActions.MarkTimerDone>(
      timerFeatureActions.ActionTypes.MARK_TIMER_DONE
    ),
    map(action => {
      this.store$.dispatch(new doneFeatureActions.AddDoneRequested({timer: action.payload.timer}));
      return action.payload.timer;
    }),
    tap((timer) => {
      const actionId = timer.id;
      const undoableAction: UndoableAction = {
        payload: timer,
        actionId: actionId,
        actionType: timerFeatureActions.ActionTypes.MARK_TIMER_DONE
      };
      this.store$.dispatch(new undoFeatureActions.StashUndoableAction({undoableAction}));
    }),
  );

  // // Courtesy of https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  // private generateActionId(): string {
  //   let text = '';
  //   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //   for (let i = 0; i < 10; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }

  //   return text;
  // }
}
