import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UndoSnackbarConfig } from '../models/undoSnackbarConfig.model';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  undoTransporter = new Subject<string>();

  constructor(
    private snackbar: MatSnackBar,
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
}
