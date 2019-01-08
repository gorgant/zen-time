import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Timer } from '../models/timer.model';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    // private db: AngularFirestore,
    private userService: UserService
  ) { }

  fetchAllTimers(): Observable<Timer[]> {
    return this.getTimerCollection()
      .snapshotChanges()
      .pipe(
        map(docArray => {
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
    console.log('Fetching single timer', timerId);
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

  private getTimerCollection(): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const timerCollection = userDoc.collection<Timer>('timers');
    return timerCollection;
  }

  private getTimerDoc(timerId: string): AngularFirestoreDocument<Timer> {
    return this.getTimerCollection().doc<Timer>(`${timerId}`);
  }

}
