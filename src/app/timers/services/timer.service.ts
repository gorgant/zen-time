import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Timer } from '../models/timer.model';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private db: AngularFirestore,
    private userService: UserService
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

  saveTimer(timer: Timer) {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.update(timer);
    console.log('Updated timer in database', timer);
    // Convert this return to an observable to be consumed properly by the store effects
    return of(timer);
  }

  createTimer(timer: Timer) {
    const timerDoc = this.getTimerDoc(timer.id);
    timerDoc.set(timer);
    console.log('Created timer in database', timer);
    // Convert this return to an observable to be consumed properly by the store effects
    return of(timer);
  }

  deleteTimer(timerId: string) {
    const timerDoc = this.getTimerDoc(timerId);
    timerDoc.delete();
    console.log('Deleted timer with ID', timerId);
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

  private getTimerDoc(timerId: string): AngularFirestoreDocument<Timer> {
    return this.getTimerCollection().doc<Timer>(`${timerId}`);
  }

}
