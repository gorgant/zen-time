import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Timer } from '../models/timer.model';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private uiService: UiService
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

  updateTimer(timer: Timer): Observable<Timer> {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.update(timer);
    this.uiService.showSnackBar(`Timer updated`, null, 3000);
    return of(timer);
  }

  updateDone(timer: Timer): Observable<Timer> {
    const timerDoc = this.getDoneDoc(timer.id);
    timerDoc.update(timer);
    this.uiService.showSnackBar(`Timer updated`, null, 3000);
    return of(timer);
  }

  createTimer(timer: Timer): Observable<Timer> {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.set(timer);
    this.uiService.showSnackBar(`Timer created: ${timer.title}`, null, 3000);
    return of(timer);
  }

  createDone(timer: Timer): Observable<Timer> {
    const timerDoc = this.getDoneDoc(timer.id);
    timerDoc.set(timer);
    this.uiService.showSnackBar(`Timer created: ${timer.title}`, null, 3000);
    return of(timer);
  }

  deleteTimer(timerId: string): Observable<string> {
    const timerDoc = this.getTimerDoc(timerId);
    timerDoc.delete();
    this.uiService.showSnackBar(`Timer deleted`, null, 3000);
    return of(timerId);
  }

  deleteDone(timerId: string): Observable<string> {
    const timerDoc = this.getDoneDoc(timerId);
    timerDoc.delete();
    this.uiService.showSnackBar(`Timer deleted`, null, 3000);
    return of(timerId);
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
