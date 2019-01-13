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

  onEditTimer() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    // Must be 'matButton' and #matButton
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
        this.router.navigate(['../']);
      });
  }

  onDeleteTimer() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent);
    dialogRef.afterClosed().subscribe(userCanceled => {
      if (userCanceled) {
        this.store$.dispatch(new TimerStoreActions.DeleteTimerRequested({timerId: this.timerId}));
        this.router.navigate(['../']);
        // this.uiService.showSnackBar('Timer deleted', null, 3000);
      } else {
        // Do nothing
      }
    });
  }
}
