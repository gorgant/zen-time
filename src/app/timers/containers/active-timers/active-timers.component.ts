import { Component, OnInit } from '@angular/core';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions, UserStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { TimerImporterService } from 'src/app/shared/utils/timer-importer';
import { map, withLatestFrom, take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TimerFormDialogueComponent } from '../../components/timer-form-dialogue/timer-form-dialogue.component';
import { VAPID_PUBLIC_KEY } from 'src/app/shared/utils/vapid-key';

@Component({
  selector: 'app-active-timers',
  templateUrl: './active-timers.component.html',
  styleUrls: ['./active-timers.component.scss']
})
export class ActiveTimersComponent implements OnInit {

  timers$: Observable<Timer[]>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;
  readonly VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;

  pushPermissionStatus$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private timerImporterService: TimerImporterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.timers$ = this.store$.select(
      TimerStoreSelectors.selectAllTimers
    ).pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectAppUser),
        this.store$.select(TimerStoreSelectors.selectTimersLoaded),
      ),
      map(([timers, appUser, timersLoaded]) => {
        // Fetch timer if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new TimerStoreActions.AllTimersRequested({userId: appUser.id})
          );
        }
        return timers;
      })
    );

    this.error$ = this.store$.select(
      TimerStoreSelectors.selectTimerError
    );

    this.isLoading$ = this.store$.select(
      TimerStoreSelectors.selectTimerIsLoading
    );

    this.pushPermissionStatus$ = this.store$.select(
      UserStoreSelectors.selectPushPermissionSet
    );

    // Check for notification settings on browser
    if (!('Notification' in window)) {
      console.log('Browser doesnt support notifications');
      // Browser doesn't support standard notifications
      this.store$.dispatch(new UserStoreActions.SetPushPermission());
    } else if (Notification.permission === 'granted') {
      console.log('Notifications allowed');
      // Browser accepts notifications
      this.store$.dispatch(new UserStoreActions.SetPushPermission());
    } else if (Notification.permission === 'denied') {
      console.log('Notifications denied');
      // Browser blocks notifications
      this.store$.dispatch(new UserStoreActions.SetPushPermission());
    } else {
      console.log('Notifications not yet set');
      // Do not modify push permissions
    }
  }

  onCreateTimer() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(TimerFormDialogueComponent, dialogConfig);
  }

  onImport() {
    this.store$.select(UserStoreSelectors.selectAppUser)
      .pipe(take(1))
      .subscribe(appUser => {
        this.timerImporterService.launchImport(appUser.id);
      });
  }

}

