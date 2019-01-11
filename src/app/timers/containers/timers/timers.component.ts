import { Component, OnInit } from '@angular/core';
import { RootStoreState, TimerStoreSelectors, TimerStoreActions, AuthStoreSelectors } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { TimerImporterService } from 'src/app/shared/utils/timer-importer';
import { map, withLatestFrom } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TimerFormDialogueComponent } from '../../components/timer-form-dialogue/timer-form-dialogue.component';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  appUser$: Observable<AppUser>;

  timers$: Observable<Timer[]>;
  error$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private timerImporterService: TimerImporterService,
    private dialog: MatDialog,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

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
