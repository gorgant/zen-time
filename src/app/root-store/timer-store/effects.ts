import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as timerFeatureActions from './actions';
import * as doneFeatureActions from '../done-store/actions';
import * as undoFeatureActions from '../undo-store/actions';
import * as timerFeatureSelectors from './selectors';
import * as uiFeatureSelectors from '../ui-store/selectors';
import { switchMap, map, catchError, mergeMap, tap, take, withLatestFrom } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';
import { RootStoreState } from '..';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

@Injectable()
export class TimerStoreEffects {
  constructor(
    private timerService: TimerService,
    private actions$: Actions,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  singleTimerRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.SingleTimerRequested>(
      timerFeatureActions.ActionTypes.SINGLE_TIMER_REQUESTED
    ),
    mergeMap(action =>
      this.timerService.fetchSingleTimer(action.payload.userId, action.payload.timerId)
        .pipe(
          map(timer => new timerFeatureActions.SingleTimerLoaded({timer})),
          catchError(error => {
            return of(new timerFeatureActions.LoadErrorDetected({ error }));
          }
          )
        )
    )
  );

  @Effect({ dispatch: false})
  allTimersRequestedEffect$: Observable<void | timerFeatureActions.LoadErrorDetected> = this.actions$.pipe(
    ofType<timerFeatureActions.AllTimersRequested>(
      timerFeatureActions.ActionTypes.ALL_TIMERS_REQUESTED
    ),
    switchMap( action =>
      this.timerService.fetchAllTimers(action.payload.userId)
        .pipe(
          withLatestFrom(
            this.store$.select(timerFeatureSelectors.selectAllTimers),
            this.store$.select(timerFeatureSelectors.selectTimersLoaded),
            this.store$.select(timerFeatureSelectors.selectProcessingClientRequest),
            this.store$.select(uiFeatureSelectors.selectIsOnline)
          ),
          // take(1),
          map(([serverTimers, storeTimers, timersLoaded, proccesingClientRequest, isOnline]) => {
            // If timers haven't loaded yet, pull from server
            if (!timersLoaded) {
              console.log('Timers not yet loaded, grabbing all of them', serverTimers);
              return this.store$.dispatch(new timerFeatureActions.AllTimersLoaded({timers: serverTimers}));
            }

            // This epic set of if statements prevents mass refresh of timers which screws up animations
            // ...instead allowing for individual fixes where possible
            if (!proccesingClientRequest || !isOnline) {
              console.log('non-client request or offline request detected');
              // If timers have already loaded, check for inconsistencies
              if (serverTimers.length !== storeTimers.length) {
                // If addition occurs on server (e.g., added in another window), update those specific items in store
                if (serverTimers.length > storeTimers.length) {
                  console.log('Server timers > store timers', serverTimers);
                  // Create array timers that are on server but not in store
                  const noIdMatchArray = serverTimers.filter(timer => !storeTimers.some(storeT => timer.id === storeT.id));
                  // Create new array to update store with
                  let updatedStoreTimers = [...storeTimers];
                  if (noIdMatchArray.length > 0) {
                    noIdMatchArray.forEach((timer, index, array) => {
                      console.log('Adding timer to store', timer);
                      // Add to store directly (don't dispatch action, which would add a circular loop to server)
                      this.store$.dispatch(new timerFeatureActions.AddTimerComplete({timer}));
                      updatedStoreTimers = [
                        ...updatedStoreTimers,
                        timer
                      ];
                    });
                  }
                } else if (serverTimers.length < storeTimers.length) {
                  console.log('Server timers < store timers', serverTimers);
                // If deletion occurs on server (e.g., deleted in another window), update those specific items in store
                  const noMatchArray = storeTimers.filter(timer => !serverTimers.some(serverT => timer.id === serverT.id));
                  let updatedStoreTimers = [...storeTimers];
                  noMatchArray.forEach((timer, index, array) => {
                    console.log('Removing timer from store', timer);
                    // Remove from store directly (don't dispatch action, which would add a circular loop to server)
                    this.store$.dispatch(new timerFeatureActions.DeleteTimerComplete({timerId: timer.id}));
                    updatedStoreTimers = updatedStoreTimers.filter(tmr => tmr.id !== timer.id);
                  });
                }
              } else {
              // If server change is detected, but lengths match, scan timer attributes for changes
                const noTitleMatchArray = serverTimers.filter(timer => !storeTimers.some(storeT => timer.title === storeT.title));
                const noCategoryMatchArray = serverTimers.filter(timer => !storeTimers.some(storeT => timer.category === storeT.category));
                const noNotesMatchArray = serverTimers.filter(timer => !storeTimers.some(storeT => timer.notes === storeT.notes));
                const noDurationMatchArray = serverTimers.filter(timer => !storeTimers.some(storeT => timer.duration === storeT.duration));
                const combinedNoAttributeMatchArray = ([] as Timer[])
                  .concat(
                  noTitleMatchArray, noCategoryMatchArray, noNotesMatchArray, noDurationMatchArray
                  );

                // Remove duplicates from array (happens when multiple changes to single timer)
                // tslint:disable-next-line:max-line-length
                // De-dupe code courtesy of: https://stackoverflow.com/questions/32238602/javascript-remove-duplicates-of-objects-sharing-same-property-value
                const mySet = new Set();
                const combArrayDeduped = combinedNoAttributeMatchArray.filter(timer => {
                  const key: string = timer.id;
                  const isNew: boolean = !mySet.has(key);
                  if (isNew) {
                    mySet.add(key);
                  }
                  return isNew;
                });

                // If modified timers found, update them in the store
                if (combArrayDeduped.length > 0) {
                  combArrayDeduped.forEach((timer, index, array) => {
                    const modifedTimer = serverTimers.filter(svrTimer => svrTimer.id === timer.id)[0];
                    const updatedTimer: Update<Timer> = {
                      id: modifedTimer.id,
                      changes: modifedTimer
                    };
                    this.store$.dispatch(new timerFeatureActions.UpdateTimerComplete({timer: updatedTimer}));
                  });
                }
              }
            }
          }),
          catchError(error => {
            return of(new timerFeatureActions.LoadErrorDetected({ error }));
          })
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
    mergeMap(action => this.timerService.updateTimer(action.payload.userId, action.payload.timer, action.payload.undoAction).pipe(
      map(timer => {
        const timerUp: Update<Timer> = {
          id: timer.id,
          changes: timer
        };
        return new timerFeatureActions.UpdateTimerComplete({timer: timerUp});
      }),
      catchError(error => {
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  addTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.AddTimerRequested>(
      timerFeatureActions.ActionTypes.ADD_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.createTimer(action.payload.userId, action.payload.timer, action.payload.undoAction).pipe(
      map(timerWithId => {
        return new timerFeatureActions.AddTimerComplete({timer: timerWithId});
      }),
      catchError(error => {
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.DeleteTimerRequested>(
      timerFeatureActions.ActionTypes.DELETE_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.deleteTimer(action.payload.userId, action.payload.timer, action.payload.markDone).pipe(
      map(timerId => {
        console.log('Deleting timer');
        return new timerFeatureActions.DeleteTimerComplete({timerId});
      } ),
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
      console.log('Dispatching "Add Done" as a part of "Mark Done"');
      this.store$.dispatch(new doneFeatureActions.AddDoneRequested({userId: action.payload.userId, timer: action.payload.timer}));
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

  @Effect()
  createDemoTimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<timerFeatureActions.CreateDemoTimerRequested>(
      timerFeatureActions.ActionTypes.CREATE_DEMO_TIMER_REQUESTED
    ),
    mergeMap(action => this.timerService.createDemoTimer(action.payload.userId).pipe(
      map(timerWithId => {
        return new timerFeatureActions.CreateDemoTimerComplete({timer: timerWithId});
      }),
      catchError(error => {
        return of(new timerFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );
}
