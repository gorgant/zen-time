import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TimerFormDialogueComponent } from '../../components/timer-form-dialogue/timer-form-dialogue.component';
import { DeleteConfirmDialogueComponent } from '../../components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { SetReminderDialogueComponent } from '../../components/set-reminder-dialogue/set-reminder-dialogue.component';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-active-timer',
  templateUrl: './active-timer.component.html',
  styleUrls: ['./active-timer.component.scss']
})
export class ActiveTimerComponent implements OnInit, OnDestroy {

  timer$: Observable<Timer>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;
  timerId: string;
  reminderUrl: string;
  coundownClock: CountDownClock;
  timerLoaded: boolean;

  editTimerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
    private router: Router,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.timerId = this.route.snapshot.params['id'];

    // Load timer
    this.timer$ = this.store$.select(
      TimerStoreSelectors.selectTimerById(this.timerId)
    ).pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectAppUser),
        this.store$.select(TimerStoreSelectors.selectTimersLoaded),
      ),
      map(([timer, appUser, timersLoaded]) => {
        // Fetch timers if store hasn't been initialized
        if (!timersLoaded && !this.timerLoaded) {
          this.store$.dispatch(
            new TimerStoreActions.SingleTimerRequested({userId: appUser.id, timerId: this.timerId})
          );
          // Prevents this from firing a bunch of extra times
          this.timerLoaded = true;
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

    // Listen for clicks to edit button in header
    this.editTimerSubscription = this.uiService.editTimerSignal$
      .subscribe(onClick =>
        this.editTimer()
      );
  }

  onSetReminder() {
    this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.width = '400px';
        dialogConfig.data = timer;

        const dialogRef = this.dialog.open(SetReminderDialogueComponent, dialogConfig);
      });
  }

  editTimer() {
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
      .pipe(
        take(1),
        withLatestFrom(
          this.store$.select(UserStoreSelectors.selectAppUser)
        )
      )
      .subscribe(([timer, appUser]) => {
        this.store$.dispatch(new TimerStoreActions.MarkTimerDone({userId: appUser.id, timer: timer}));
        this.router.navigate(['../'], {relativeTo: this.route});
      });
  }

  onDeleteTimer() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      this.timer$
      .pipe(
        take(1),
        withLatestFrom(
          this.store$.select(UserStoreSelectors.selectAppUser)
        )
      )
      .subscribe(([timer, appUser]) => {
        if (userConfirmed) {
          this.store$.dispatch(new TimerStoreActions.DeleteTimerRequested({userId: appUser.id, timer}));
          this.router.navigate(['../'], {relativeTo: this.route});
        } else {
          // Do nothing
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.editTimerSubscription) {
      this.editTimerSubscription.unsubscribe();
    }
  }
}
