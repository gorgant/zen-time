import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Timer } from '../models/timer.model';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { now } from 'moment';
import { UndoSnackbarConfig } from 'src/app/shared/models/undoSnackbarConfig.model';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private uiService: UiService,
  ) { }

  fetchAllTimers(): Observable<Timer[]> {
    return this.getTimerCollection()
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw(new Error());
          return docArray.map(doc => {
            const timer: Timer = {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
            return timer;
          });
        })
      );
  }

  fetchAllDone(): Observable<Timer[]> {
    return this.getDoneCollection()
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw(new Error());
          return docArray.map(doc => {
            const timer: Timer = {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
            return timer;
          });
        })
      );
  }

  fetchSingleTimer(timerId: string): Observable<Timer> {
    return this.getTimerDoc(timerId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const timer: Timer = {
            id: doc.payload.id,
            ...doc.payload.data()
          };
          return timer;
        })
      );
  }

  fetchSingleDone(timerId: string): Observable<Timer> {
    return this.getDoneDoc(timerId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const timer: Timer = {
            id: doc.payload.id,
            ...doc.payload.data()
          };
          return timer;
        })
      );
  }

  updateTimer(timer: Timer, undoAction: boolean): Observable<Timer> {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.update(timer);
    if (!undoAction) {
      const undoSnackbarConfig: UndoSnackbarConfig = {
        duration: 5000,
        actionId: timer.id
      };
      this.uiService.showUndoSnackBar(`Timer updated`, 'Undo', undoSnackbarConfig);
    }
    return of(timer);
  }

  // updateDone(timer: Timer): Observable<Timer> {
  //   const timerDoc = this.getDoneDoc(timer.id);
  //   timerDoc.update(timer);
  //   this.uiService.showSnackBar(`Timer updated`, null, 3000);
  //   return of(timer);
  // }

  createTimer(timer: Timer, undoAction?: boolean): Observable<Timer> {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.set(timer);
    if (!undoAction) {
      this.uiService.showSnackBar(`Timer created: ${timer.title}`, null, 3000);
    }
    return of(timer);
  }

  createDone(timer: Timer, undoAction?: boolean): Observable<Timer> {
    const convertedTimer: Timer = {
      ...timer
    };
    if (!undoAction) {
      convertedTimer.completedDate = now();
      const undoSnackbarConfig: UndoSnackbarConfig = {
        duration: 5000,
        actionId: timer.id
      };
      this.uiService.showUndoSnackBar(`Timer Marked Complete: ${convertedTimer.title}`, 'Undo', undoSnackbarConfig);
    }
    const timerDoc = this.getDoneDoc(convertedTimer.id);
    timerDoc.set(convertedTimer);
    return of(convertedTimer);
  }

  deleteTimer(timer: Timer, completeTimer?: boolean): Observable<string> {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.delete();
    if (!completeTimer) {
      const undoSnackbarConfig: UndoSnackbarConfig = {
        duration: 5000,
        actionId: timer.id
      };
      this.uiService.showUndoSnackBar(`Timer deleted`, 'Undo', undoSnackbarConfig);
    }
    return of(timer.id);
  }

  deleteDone(timer: Timer, undoAction?: boolean): Observable<string> {
    const timerDoc = this.getDoneDoc(timer.id);
    timerDoc.delete();
    if (!undoAction) {
      const undoSnackbarConfig: UndoSnackbarConfig = {
        duration: 5000,
        actionId: timer.id
      };
      this.uiService.showUndoSnackBar(`Timer deleted`, 'Undo', undoSnackbarConfig);
    }
    return of(timer.id);
  }

  generateTimerId(): string {
    return this.db.createId();
  }

  private getTimerCollection(): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const timerCollection = userDoc.collection<Timer>('timers');
    return timerCollection;
  }

  private getDoneCollection(): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const timerCollection = userDoc.collection<Timer>('done');
    return timerCollection;
  }

  private getTimerDoc(timerId: string): AngularFirestoreDocument<Timer> {
    return this.getTimerCollection().doc<Timer>(`${timerId}`);
  }

  private getDoneDoc(timerId: string): AngularFirestoreDocument<Timer> {
    return this.getDoneCollection().doc<Timer>(`${timerId}`);
  }

}
