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

  fetchTimers(): Observable<Timer[]> {
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

  private getTimerCollection(): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const timerCollection = userDoc.collection<Timer>('timers');
    return timerCollection;
  }
}
