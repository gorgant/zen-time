import { Component, OnInit, ViewChild } from '@angular/core';
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
  DoneStoreActions,
  AuthStoreSelectors,
  UiStoreActions
} from './root-store';
import { withLatestFrom, take, map } from 'rxjs/operators';
import { UiService } from './shared/services/ui.service';
import { Timer } from './timers/models/timer.model';
import { ActionTypes as TimerActionTypes } from './root-store/timer-store/actions';
import { ActionTypes as DoneActionTypes } from './root-store/done-store/actions';
import { SwUpdate } from '@angular/service-worker';
import { MatSidenav } from '@angular/material';
import { ConnectionService } from './shared/services/connection.service';
import { Observable, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zen-time';
  @ViewChild('sidenav') sidenav: MatSidenav;
  connectionStatus$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService,
    private swUpdate: SwUpdate,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // This checks if app starts offline
    setTimeout(() => {
      this.connectionService.checkConnectionStatus();
    });
    this.connectionStatus$ = this.connectionService.monitorConnectionStatus();
    this.connectionService.monitorConnectionStatus().subscribe(online => {
      if (!online) {
        this.store$.dispatch(new UiStoreActions.AppOffline());
        this.uiService.showOfflineSnackBar();
      } else {
        this.store$.dispatch(new UiStoreActions.AppOnline());
      }
    });

    // Prompts user to update interface when app has been updated (and downloaded in their cache)
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version of ZenTimer available. Load New Version?')) {
          window.location.reload();
        }
      });
    }

    this.authService.initAuthListener();
    this.authService.authStatus
    .pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectUserIsLoading),
        this.store$.select(AuthStoreSelectors.selectIsAuth)
      )
    )
    .subscribe(([userId, userIsLoading, isAuth]) => {
      // These if statements determine how to load user data
      if (userId && !userIsLoading && !isAuth) {
        // Fires only when app is loaded and user is already logged in
        this.store$.dispatch( new AuthStoreActions.AuthenticationComplete());
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (userId && !userIsLoading && isAuth) {
        // Fires only when user logged in via Google Auth
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (!userId && isAuth) {
        // Fires only when logout detected on separate client, logs out user automatically
        this.authService.logout();
        this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
      }
    });

    // Handles sideNav clicks
    this.uiService.sideNavSignal$.subscribe(signal => {
      this.toggleSideNav();
    });

    // This handles Undo requests (can't do it in timer service b/c circular dependencies)
    this.uiService.undoTransporter
      .subscribe(actionId => {
        const undoableAction$ = this.store$.select(UndoStoreSelectors.selectUndoById(actionId));
        undoableAction$
          .pipe(
            take(1),
            withLatestFrom(this.store$.select(UserStoreSelectors.selectAppUser))
          )
          .subscribe(([undoableAction, appUser]) => {
            switch (undoableAction.actionType) {
              case TimerActionTypes.DELETE_TIMER_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new TimerStoreActions.AddTimerRequested({userId: appUser.id, timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case TimerActionTypes.UPDATE_TIMER_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new TimerStoreActions.UpdateTimerRequested({userId: appUser.id, timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case TimerActionTypes.MARK_TIMER_DONE: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new DoneStoreActions.DeleteDoneRequested({userId: appUser.id, timer, undoAction: true}));
                this.store$.dispatch(new TimerStoreActions.AddTimerRequested({userId: appUser.id, timer, undoAction: true}));
                this.store$.dispatch(new UndoStoreActions.PurgeUndoableAction({undoableAction}));
                return true;
              }
              case DoneActionTypes.DELETE_DONE_REQUESTED: {
                const timer: Timer = undoableAction.payload;
                this.store$.dispatch(new DoneStoreActions.AddDoneRequested({userId: appUser.id, timer, undoAction: true}));
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

  toggleSideNav() {
    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }
}
