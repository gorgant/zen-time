import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore
  ) { }

  fetchUserData(userId: string): Observable<AppUser> {
    return this.db.doc<AppUser>(`users/${userId}`).valueChanges();
  }

  storeUserData(userData: AppUser, userId: string): void {
    const userCollection = this.db.collection<AppUser>('users');
    userCollection.doc(userId).set(userData);
  }
}
