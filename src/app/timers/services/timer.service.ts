import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError, from } from 'rxjs';
import { Timer } from '../models/timer.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { now } from 'moment';
import { UndoSnackbarConfig } from 'src/app/shared/models/undoSnackbarConfig.model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private uiService: UiService,
    private authService: AuthService
  ) { }

  fetchAllTimers(userId: string): Observable<Timer[]> {
    return this.getTimerCollection(userId)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(docArray => {
          // throw(new Error('Test error'));
          return docArray.map(doc => {
            const timer: Timer = {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
            return timer;
          });
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchAllDone(userId: string): Observable<Timer[]> {
    return this.getDoneCollection(userId)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(docArray => {
          // throw(new Error());
          return docArray.map(doc => {
            const timer: Timer = {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
            return timer;
          });
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchSingleTimer(userId: string, timerId: string): Observable<Timer> {
    return this.getTimerDoc(userId, timerId)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(doc => {
          const timer: Timer = {
            id: doc.payload.id,
            ...doc.payload.data()
          };
          return timer;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchSingleDone(userId: string, timerId: string): Observable<Timer> {
    return this.getDoneDoc(userId, timerId)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(doc => {
          const timer: Timer = {
            id: doc.payload.id,
            ...doc.payload.data()
          };
          return timer;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  updateTimer(userId: string, timer: Timer, undoAction: boolean): Observable<Timer> {
    const timerDoc = this.getTimerDoc(userId, timer.id);
    const fbResponse = timerDoc.update(timer)
      .then(empty => {
        if (!undoAction) {
          const undoSnackbarConfig: UndoSnackbarConfig = {
            duration: 5000,
            actionId: timer.id
          };
          this.uiService.showUndoSnackBar(`Timer updated`, 'Undo', undoSnackbarConfig);
        }
        return timer;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  createTimer(userId: string, timer: Timer, undoAction?: boolean): Observable<Timer> {
    const timerDoc = this.getTimerDoc(userId, timer.id);
    const fbResponse = timerDoc.set(timer)
      .then(empty => {
        if (!undoAction) {
          this.uiService.showSnackBar(`Timer created: ${timer.title}`, null, 3000);
        }
        console.log('Timer created on server');
        return timer;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  createDone(userId: string, timer: Timer, undoAction?: boolean): Observable<Timer> {
    const convertedTimer: Timer = {
      ...timer
    };
    if (!undoAction) {
      convertedTimer.completedDate = now();
    }
    const timerDoc = this.getDoneDoc(userId, convertedTimer.id);
    const fbResponse = timerDoc.set(convertedTimer)
      .then(empty => {
        if (!undoAction) {
          const undoSnackbarConfig: UndoSnackbarConfig = {
            duration: 5000,
            actionId: timer.id
          };
          this.uiService.showUndoSnackBar(`Timer Marked Complete: ${convertedTimer.title}`, 'Undo', undoSnackbarConfig);
        }
        console.log('Done created on server');
        return convertedTimer;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  deleteTimer(userId: string, timer: Timer, completeTimer?: boolean): Observable<string> {
    const timerDoc = this.getTimerDoc(userId, timer.id);
    const fbResponse = timerDoc.delete()
      .then(empty => {
        if (!completeTimer) {
          const undoSnackbarConfig: UndoSnackbarConfig = {
            duration: 5000,
            actionId: timer.id
          };
          this.uiService.showUndoSnackBar(`Timer deleted`, 'Undo', undoSnackbarConfig);
        }
        console.log('Timer deleted on server');
        return timer.id;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  deleteDone(userId: string, timer: Timer, undoAction?: boolean): Observable<string> {
    const timerDoc = this.getDoneDoc(userId, timer.id);
    const fbResponse = timerDoc.delete()
      .then(empty => {
        if (!undoAction) {
          const undoSnackbarConfig: UndoSnackbarConfig = {
            duration: 5000,
            actionId: timer.id
          };
          this.uiService.showUndoSnackBar(`Timer deleted`, 'Undo', undoSnackbarConfig);
        }
        console.log('Done deleted on server');
        return timer.id;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  generateTimerId(): string {
    return this.db.createId();
  }

  createDemoTimer(userId: string): Observable<Timer> {
    console.log('Creating demo timer for id', userId);
    const timerId = this.generateTimerId();
    const timerDoc = this.getTimerDoc(userId, timerId);
    const demoTimer: Timer = {
      setOnDate: now(),
      title: 'Demo Timer (Click Me!)',
      category: 'Demo Category',
      // tslint:disable-next-line:max-line-length
      notes: 'This is where you can view details about your timer. You can edit your timer using the button on the top right. You can use the actions below to Complete the timer, Delete the timer, or add it to a calendar of your choice using the Add to Calendar.',
      duration: 15552000000,
      dueDate: now() + 15552000000,
      id: timerId
    };
    const fbResponse = timerDoc.set(demoTimer)
      .then(empty => {
        return demoTimer;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }


  private getTimerCollection(userId: string): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.fetchUserDoc(userId);
    console.log('Fetched user doc from user service', userDoc);
    const timerCollection = userDoc.collection<Timer>('timers');
    return timerCollection;
  }

  private getDoneCollection(userId: string): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.fetchUserDoc(userId);
    const timerCollection = userDoc.collection<Timer>('done');
    return timerCollection;
  }

  private getTimerDoc(userId: string, timerId: string): AngularFirestoreDocument<Timer> {
    return this.getTimerCollection(userId).doc<Timer>(`${timerId}`);
  }

  private getDoneDoc(userId: string, timerId: string): AngularFirestoreDocument<Timer> {
    return this.getDoneCollection(userId).doc<Timer>(`${timerId}`);
  }

}
