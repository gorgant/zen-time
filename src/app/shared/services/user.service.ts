import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserDoc: AngularFirestoreDocument<AppUser>;

  constructor(
    private db: AngularFirestore
  ) { }

  fetchUserData(userId: string): Observable<AppUser> {
    this.currentUserDoc = this.db.doc<AppUser>(`users/${userId}`);
    return this.db.doc<AppUser>(`users/${userId}`)
      .snapshotChanges()
      .pipe(
        map(docSnapshot => {
          const appUser: AppUser = {
            id: docSnapshot.payload.id,
            ...docSnapshot.payload.data()
          };
          return appUser;
        })
      );
  }

  storeUserData(userData: AppUser, userId: string): Observable<any> {
    const userCollection = this.db.collection<AppUser>('users');
    return from(userCollection.doc(userId).set(userData)
      .then(response => response)
      .catch(error => error)
      );
  }

  // Provides easy access to user doc throughout the app
  get userDoc() {
    return this.currentUserDoc;
  }
}
