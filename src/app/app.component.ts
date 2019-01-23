import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  AuthStoreActions,
  UserStoreActions,
  UserStoreSelectors,
  UndoStoreSelectors,
  TimerStoreActions,
  UndoStoreActions,
  DoneStoreActions
} from './root-store';
import { withLatestFrom, take } from 'rxjs/operators';
import { UiService } from './shared/services/ui.service';
import { Timer } from './timers/models/timer.model';
import { ActionTypes as TimerActionTypes } from './root-store/timer-store/actions';
import { ActionTypes as DoneActionTypes } from './root-store/done-store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zen-time';

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.authService.initAuthListener();
    this.authService.authStatus
    .pipe(
      withLatestFrom(this.store$.select(UserStoreSelectors.selectUserIsLoading))
    )
    .subscribe(([userId, userIsLoading]) => {
      // Prevents this from firing on a standard login/registration (b/c it'll fire elsewhere)
      if (userId && !userIsLoading) {
        this.store$.dispatch( new AuthStoreActions.AuthenticationComplete());
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (!userIsLoading) {
        // Prevents this from firing when first logging in
        this.store$.dispatch( new AuthStoreActions.SetUnauthenticated);
      }
    });

    // This handles Undo requests (can't do it in timer service b/c circular dependencies)
    this.uiService.undoTransporter
      .subscribe(actionId => {
        const undoableAction$ = this.store$.select(UndoStoreSelectors.selectUndoById(actionId));
        undoableAction$
          .pipe(take(1))
          .subscribe(undoableAction => {
            switch (undoableAction.actionType) {
              case TimerActionTypes.DELETE_TIMER_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new TimerStoreActions.AddTimerRequested({timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case TimerActionTypes.UPDATE_TIMER_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new TimerStoreActions.UpdateTimerRequested({timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case TimerActionTypes.MARK_TIMER_DONE: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new DoneStoreActions.DeleteDoneRequested({timer, undoAction: true}));
                this.store$.dispatch(new TimerStoreActions.AddTimerRequested({timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case DoneActionTypes.DELETE_DONE_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new DoneStoreActions.AddDoneRequested({timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }

              default: {
                return true;
              }
            }
          });
      });
  }
}
