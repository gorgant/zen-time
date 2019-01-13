import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { Store } from '@ngrx/store';
import { RootStoreState, DoneStoreSelectors, DoneStoreActions } from 'src/app/root-store';
import { MatDialog } from '@angular/material';
import { withLatestFrom, map } from 'rxjs/operators';
import { DeleteConfirmDialogueComponent } from '../../components/delete-confirm-dialogue/delete-confirm-dialogue.component';

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
      withLatestFrom(this.store$.select(DoneStoreSelectors.selectDoneLoaded)),
      map(([timer, timersLoaded]) => {
        // Fetch timers if store hasn't been initialized
        if (!timersLoaded) {
          this.store$.dispatch(
            new DoneStoreActions.SingleDoneRequested({timerId: this.timerId})
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

  // onEditDone() {
  //   // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
  //   // Must be 'matButton' and #matButton
  //   this.matButton._elementRef.nativeElement.blur();

  //   this.timer$
  //     .pipe(take(1))
  //     .subscribe(timer => {
  //       const dialogConfig = new MatDialogConfig();

  //       dialogConfig.disableClose = true;
  //       dialogConfig.autoFocus = true;
  //       dialogConfig.width = '400px';

  //       dialogConfig.data = timer;

  //       const dialogRef = this.dialog.open(TimerFormDialogueComponent, dialogConfig);
  //     });
  // }

  // onCompleteTimer() {
  //   this.timer$
  //     .pipe(take(1))
  //     .subscribe(timer => {
  //       this.store$.dispatch(new DoneStoreActions.MarkTimerDone({timer: timer}));
  //       this.router.navigate(['../']);
  //     });
  // }

  onDeleteTimer() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent);
    dialogRef.afterClosed().subscribe(userCanceled => {
      if (userCanceled) {
        this.store$.dispatch(new DoneStoreActions.DeleteDoneRequested({timerId: this.timerId}));
        this.router.navigate(['../']);
        // this.uiService.showSnackBar('Timer deleted', null, 3000);
      } else {
        // Do nothing
      }
    });
  }

}
