import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackBar(message, action, duration: number) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = duration;
    snackBarConfig.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    this.snackbar.open(message, action, snackBarConfig);
  }
}
