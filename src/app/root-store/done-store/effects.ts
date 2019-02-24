import { Injectable } from '@angular/core';
import { TimerService } from 'src/app/timers/services/timer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as doneFeatureActions from './actions';
import * as timerFeatureActions from '../timer-store/actions';
import * as undoFeatureActions from '../undo-store/actions';
import * as doneFeatureSelectors from './selectors';
import { mergeMap, map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { RootStoreState } from '..';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';
import { Timer } from 'src/app/timers/models/timer.model';
import { Update } from '@ngrx/entity';

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

  // @Effect()
  // allDoneRequestedEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<doneFeatureActions.AllDoneRequested>(
  //     doneFeatureActions.ActionTypes.ALL_DONE_REQUESTED
  //   ),
  //   switchMap(action =>
  //     this.timerService.fetchAllDone()
  //       .pipe(
  //         map(timers => new doneFeatureActions.AllDoneLoaded({timers: timers})),
  //         catchError(error => {
  //           return of(new doneFeatureActions.LoadErrorDetected({ error }));
  //         }
  //         )
  //       )
  //   )
  // );

  @Effect({ dispatch: false})
  allDoneRequestedEffect$: Observable<void | doneFeatureActions.LoadErrorDetected> = this.actions$.pipe(
    ofType<doneFeatureActions.AllDoneRequested>(
      doneFeatureActions.ActionTypes.ALL_DONE_REQUESTED
    ),
    switchMap( action =>
      this.timerService.fetchAllDone()
        .pipe(
          withLatestFrom(
            this.store$.select(doneFeatureSelectors.selectAllDone),
            this.store$.select(doneFeatureSelectors.selectDoneLoaded)
          ),
          map(([serverDone, storeDone, doneLoaded]) => {
            // If timers haven't loaded yet, pull from server
            if (!doneLoaded) {
              return this.store$.dispatch(new doneFeatureActions.AllDoneLoaded({timers: serverDone}));
            }

            // This epic set of if statements prevents mass refresh of timers which screws up animations
            // ...instead allowing for individual fixes where possible

            // If timers have already loaded, check for inconsistencies
            if (serverDone.length !== storeDone.length) {
              // If addition occurs on server (e.g., added in another window), update those specific items in store
              if (serverDone.length > storeDone.length) {
                // Create array timers that are on server but not in store
                const noIdMatchArray = serverDone.filter(timer => !storeDone.some(storeT => timer.id === storeT.id));
                // Create new array to update store with
                let updatedStoreTimers = [...storeDone];
                if (noIdMatchArray.length > 0) {
                  noIdMatchArray.forEach((timer, index, array) => {
                    // Add to store directly (don't dispatch action, which would add a circular loop to server)
                    this.store$.dispatch(new doneFeatureActions.AddDoneComplete({timer}));
                    updatedStoreTimers = [
                      ...updatedStoreTimers,
                      timer
                    ];
                  });
                }
                // // Return the updated timer array to the effect (I guess this doesn't fire until the forEach above is complete)
                // return new doneFeatureActions.AllDoneLoaded({timers: updatedStoreTimers});
              } else if (serverDone.length < storeDone.length) {
              // If deletion occurs on server (e.g., deleted in another window), update those specific items in store
                const noMatchArray = storeDone.filter(timer => !serverDone.some(serverT => timer.id === serverT.id));
                let updatedStoreTimers = [...storeDone];
                noMatchArray.forEach((timer, index, array) => {
                  // Remove from store directly (don't dispatch action, which would add a circular loop to server)
                  this.store$.dispatch(new doneFeatureActions.DeleteDoneComplete({timerId: timer.id}));
                  updatedStoreTimers = updatedStoreTimers.filter(tmr => tmr.id !== timer.id);
                });
              }
            } else {
            // If server change is detected, but lengths match, scan timer attributes for changes
              const noTitleMatchArray = serverDone.filter(timer => !storeDone.some(storeT => timer.title === storeT.title));
              const noCategoryMatchArray = serverDone.filter(timer => !storeDone.some(storeT => timer.category === storeT.category));
              const noNotesMatchArray = serverDone.filter(timer => !storeDone.some(storeT => timer.notes === storeT.notes));
              const noDurationMatchArray = serverDone.filter(timer => !storeDone.some(storeT => timer.duration === storeT.duration));
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
                  const modifedTimer = serverDone.filter(svrTimer => svrTimer.id === timer.id)[0];
                  const updatedTimer: Update<Timer> = {
                    id: modifedTimer.id,
                    changes: modifedTimer
                  };
                  this.store$.dispatch(new doneFeatureActions.UpdateDoneComplete({timer: updatedTimer}));
                });
              }
            }
          }),
          catchError(error => {
            return of(new doneFeatureActions.LoadErrorDetected({ error }));
          })
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
          console.log('Dispatching "Delete Timer" as a part of "Mark Done"');
          this.store$.dispatch(new timerFeatureActions.DeleteTimerRequested({timer: action.payload.timer, markDone: true}));
        }
      }),
      map(completedTimer => {
        console.log('Adding Done to store');
        return new doneFeatureActions.AddDoneComplete({timer: completedTimer});
      }),
      catchError(error => {
        return of(new doneFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  // @Effect()
  // addDoneEffect$ = this.actions$.pipe(
  //   ofType<doneFeatureActions.AddDoneRequested>(
  //     doneFeatureActions.ActionTypes.ADD_DONE_REQUESTED
  //   ),
  //   mergeMap(action => this.timerService.createDone(action.payload.timer, action.payload.undoAction).pipe(
  //     map(completedTimer => {
  //       console.log('Adding Done to store');
  //       return new doneFeatureActions.AddDoneComplete({timer: completedTimer});
  //     }),
  //     tap(completedTimer => {
  //       if (!action.payload.undoAction) {
  //         console.log('Dispatching "Delete Timer" as a part of "Mark Done"');
  //         this.store$.dispatch(new timerFeatureActions.DeleteTimerRequested({timer: action.payload.timer, markDone: true}));
  //       }
  //     }),
  //     catchError(error => {
  //       return of(new doneFeatureActions.LoadErrorDetected({ error }));
  //     })
  //   )),
  // );

  // @Effect({ dispatch: false})
  // addDoneEffect$ = this.actions$.pipe(
  //   ofType<doneFeatureActions.AddDoneRequested>(
  //     doneFeatureActions.ActionTypes.ADD_DONE_REQUESTED
  //   ),
  //   tap(action => {
  //     if (!action.payload.undoAction) {
  //       this.store$.dispatch(new timerFeatureActions.DeleteTimerRequested({timer: action.payload.timer, markDone: true}));
  //     }
  //     this.store$.dispatch(new doneFeatureActions.AddDoneComplete({timer: action.payload.timer}));
  //   }),
  //   mergeMap(action => this.timerService.createDone(action.payload.timer, action.payload.undoAction).pipe(
  //     catchError(error => {
  //       return of(new doneFeatureActions.LoadErrorDetected({ error }));
  //     })
  //   )),
  // );

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
