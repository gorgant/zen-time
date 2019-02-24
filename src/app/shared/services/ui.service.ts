import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UndoSnackbarConfig } from '../models/undoSnackbarConfig.model';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  undoTransporter = new Subject<string>();
  sideNavSignal$ = new Subject<void>();
  searchContents$ = new Subject<string>();
  editTimerSignal$ = new Subject<void>();

  constructor(
    private snackbar: MatSnackBar,
    private connectionService: ConnectionService
    ) { }

  showSnackBar(message, action, duration: number) {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);
  }

  showUndoSnackBar(message, action, snackBarInfo: UndoSnackbarConfig) {
    const config = new MatSnackBarConfig();
    config.duration = snackBarInfo.duration;
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);

    snackBarRef.onAction()
    .pipe(take(1))
    .subscribe(() => {
      this.undoTransporter.next(snackBarInfo.actionId);
    });
  }

  showOfflineSnackBar() {
    const message = 'Device is offline. Timers will sync when connection has been restored.';
    const action = 'Dismiss';
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);

    // Close snackbar if dismissed
    snackBarRef.onAction()
      .pipe(take(1))
      .subscribe(() => {
        snackBarRef.dismiss();
      });

    // Automatically close snackbar if back online
    snackBarRef.afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        this.connectionService.monitorConnectionStatus()
          // This fires when offline, then again when online
          .pipe(take(2))
          .subscribe(isOnline => {
            if (isOnline) {
              snackBarRef.dismiss();
            }
          });
      });
  }

  dispatchSideNavClick() {
    this.sideNavSignal$.next();
  }

  transmitSearchContents(searchContents: string) {
    this.searchContents$.next(searchContents);
  }

  dispatchEditTimerClick() {
    this.editTimerSignal$.next();
  }

}
