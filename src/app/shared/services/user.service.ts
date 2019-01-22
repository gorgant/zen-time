import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, Subject } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { map } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserDoc: AngularFirestoreDocument<AppUser>;
  private imageUploadPercentage$: Observable<number>;
  imgUploadPercentage = new Subject<number>();

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private uiService: UiService
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

  storeUserData(userData: AppUser, userId: string, userRegistration?: boolean): Observable<AppUser> {
    const userCollection = this.db.collection<AppUser>('users');
    const response = userCollection.doc(userId).set(userData)
      .then(empty => userData)
      .catch(error => error);
    if (!userRegistration) {
      this.uiService.showSnackBar('User info updated', null, 3000);
    }
    return from(response);
  }

  uploadProfileImage(imageFile: File, appUser: AppUser): Observable<string> {
    console.log('Image upload initiated');
    const file = imageFile;
    const filePath = `graphics/user-profile-images/${appUser.id}/profileImage`;
    const fileRef = this.storage.ref(filePath);
    // Metadata used in cloud function (marked true by cloud function after resized)
    const customMetaData = {
      resizedImage: 'false'
    };
    const task = this.storage.upload(filePath, file, {customMetadata: customMetaData});
    const logger = task;

    logger.then(result => console.log(result)).catch(error => console.log(error));

    // observe percentage changes
    this.imageUploadPercentage$ = task.percentageChanges();

    // Return URL of image
    return fileRef.getDownloadURL();
  }

  fetchDownloadUrl(imageFile: File, appUser: AppUser): Observable<string> {
    const file = imageFile;
    const filePath = `graphics/user-profile-images/${appUser.id}/profileImage`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  // Provides easy access to user doc throughout the app
  get userDoc() {
    return this.currentUserDoc;
  }

  get imageUploadPercentage() {
    return this.imageUploadPercentage$;
  }
}
