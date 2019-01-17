import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions } from 'src/app/root-store';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TimerFormDialogueComponent } from '../../components/timer-form-dialogue/timer-form-dialogue.component';
import { DeleteConfirmDialogueComponent } from '../../components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { Calendars } from 'src/app/shared/utils/calendar/calendars';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';

@Component({
  selector: 'app-active-timer',
  templateUrl: './active-timer.component.html',
  styleUrls: ['./active-timer.component.scss']
})
export class ActiveTimerComponent implements OnInit {

  timer$: Observable<Timer>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;
  @ViewChild('matButton') matButton;
  timerId: string;
  reminderUrl: string;
  coundownClock: CountDownClock;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.timerId = this.route.snapshot.params['id'];

    this.timer$ = this.store$.select(
      TimerStoreSelectors.selectTimerById(this.timerId)
    ).pipe(
      withLatestFrom(this.store$.select(TimerStoreSelectors.selectTimersLoaded)),
      map(([timer, timersLoaded]) => {
        // Fetch timers if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new TimerStoreActions.SingleTimerRequested({timerId: this.timerId})
          );
        }
        if (timer) {
          this.coundownClock = new Countdown(timer).getCountDownClock();
        }
        return timer;
      })
    );

    this.error$ = this.store$.select(
      TimerStoreSelectors.selectTimerError
    );

    this.isLoading$ = this.store$.select(
      TimerStoreSelectors.selectTimerIsLoading
    );
  }

  onSetReminder() {
    this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        this.configureReminderUrl(timer);
        window.open(this.reminderUrl);
      });
  }

  private configureReminderUrl(timer: Timer) {

    console.log('Configuring calendar');
    const calendars = new Calendars(timer);

    const googleUrl: string = calendars.getGoogleCalendarUrl();
    this.reminderUrl = googleUrl;

  }

  onEditTimer() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton._elementRef.nativeElement.blur();

    this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = timer;

        const dialogRef = this.dialog.open(TimerFormDialogueComponent, dialogConfig);
      });
  }

  onCompleteTimer() {
    this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        this.store$.dispatch(new TimerStoreActions.MarkTimerDone({timer: timer}));
        this.router.navigate(['../'], {relativeTo: this.route});
      });
  }

  onDeleteTimer() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        if (userConfirmed) {
          this.store$.dispatch(new TimerStoreActions.DeleteTimerRequested({timer}));
          this.router.navigate(['../'], {relativeTo: this.route});
          // this.uiService.showSnackBar('Timer deleted', null, 3000);
        } else {
          // Do nothing
        }
      });
    });
  }
}
