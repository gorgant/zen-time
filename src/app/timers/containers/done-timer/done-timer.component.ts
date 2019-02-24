import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { Store } from '@ngrx/store';
import { RootStoreState, DoneStoreSelectors, DoneStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { DeleteConfirmDialogueComponent } from '../../components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { TimerFormDialogueComponent } from '../../components/timer-form-dialogue/timer-form-dialogue.component';

@Component({
  selector: 'app-done-timer',
  templateUrl: './done-timer.component.html',
  styleUrls: ['./done-timer.component.scss']
})
export class DoneTimerComponent implements OnInit {

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
      DoneStoreSelectors.selectDoneById(this.timerId)
    ).pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectAppUser),
        this.store$.select(DoneStoreSelectors.selectDoneLoaded),
      ),
      map(([timer, appUser, timersLoaded]) => {
        // Fetch timers if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new DoneStoreActions.SingleDoneRequested({userId: appUser.id, timerId: this.timerId})
          );
        }
        return timer;
      })
    );

    this.error$ = this.store$.select(
      DoneStoreSelectors.selectDoneError
    );

    this.isLoading$ = this.store$.select(
      DoneStoreSelectors.selectDoneIsLoading
    );
  }

  onDuplicateTimer() {
    this.timer$
      .pipe(take(1))
      .subscribe(timer => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = timer;

        const dialogRef = this.dialog.open(TimerFormDialogueComponent, dialogConfig);

        dialogRef.afterClosed()
          .pipe(take(1))
          .subscribe(dupTimer => {
            // If duplicate was created, take user to that new timer
            if (dupTimer) {
              this.router.navigate([`timers/active/${dupTimer.id}`]);
            }
          });
      });
  }

  onDeleteTimer() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent);
    dialogRef.afterClosed()
    .pipe(
      take(1),
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectAppUser),
      ),
    )
    .subscribe(([userConfirmed, appUser]) => {
      if (userConfirmed) {
        this.timer$
        .pipe(take(1))
        .subscribe(timer => {
          this.store$.dispatch(new DoneStoreActions.DeleteDoneRequested({userId: appUser.id, timer}));
          this.router.navigate(['../'], {relativeTo: this.route});
        });
      } else {
        // Do nothing
      }
    });
  }

}
