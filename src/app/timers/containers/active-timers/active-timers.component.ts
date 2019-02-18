import { Component, OnInit } from '@angular/core';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { TimerImporterService } from 'src/app/shared/utils/timer-importer';
import { map, withLatestFrom } from 'rxjs/operators';
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
  pushPermissionsSet: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
    private timerImporterService: TimerImporterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.timers$ = this.store$.select(
      TimerStoreSelectors.selectAllTimers
    ).pipe(
      withLatestFrom(this.store$.select(TimerStoreSelectors.selectTimersLoaded)),
      map(([timers, timersLoaded]) => {
        // Fetch timer if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new TimerStoreActions.AllTimersRequested()
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

    if (Notification.permission === 'granted') {
      this.pushPermissionsSet = true;
    } else if (Notification.permission === 'denied') {
      this.pushPermissionsSet = true;
    } else {
      this.pushPermissionsSet = false;
    }

  }

  onPushSubResponse() {
    this.pushPermissionsSet = true;
  }

  onCreateTimer() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(TimerFormDialogueComponent, dialogConfig);
  }

  onImport() {
    this.timerImporterService.launchImport();
  }

}
