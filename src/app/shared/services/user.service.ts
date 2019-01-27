import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, Subject, throwError } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserDoc: AngularFirestoreDocument<AppUser>;
  private imageUploadPercentage$: Observable<number>;
  downloadUrlSubject = new Subject<string>();

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private uiService: UiService,
    private authService: AuthService,
  ) { }

  fetchUserData(userId: string): Observable<AppUser> {
    this.currentUserDoc = this.db.doc<AppUser>(`users/${userId}`);
    return this.db.doc<AppUser>(`users/${userId}`)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(docSnapshot => {
          const appUser: AppUser = {
            id: docSnapshot.payload.id,
            ...docSnapshot.payload.data()
          };
          return appUser;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  storeUserData(userData: AppUser, userId: string, userRegistration?: boolean, userEmailUpdate?: boolean): Observable<AppUser> {
    const userCollection = this.db.collection<AppUser>('users');
    const fbResponse = userCollection.doc(userId).set(userData)
      .then(() => {
        if (!userRegistration && !userEmailUpdate) {
          this.uiService.showSnackBar('User info updated', null, 3000);
        }
        return userData;
      } )
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  uploadProfileImage(imageFile: File, appUser: AppUser): Observable<string> {
    const file = imageFile;
    const filePath = `graphics/user-profile-images/${appUser.id}/profileImage`;
    const fileRef = this.storage.ref(filePath);
    // Metadata used in cloud function (marked true by cloud function after resized)
    const customMetaData = {
      resizedImage: 'false'
    };
    const task = this.storage.upload(filePath, file, {customMetadata: customMetaData});

    // Observe percentage changes
    this.imageUploadPercentage$ = task.percentageChanges();

    const fbResponse = task
      .then(() => {
        // Do nothing, but this callback provides error handling and moderates the observable query volume
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });

     return from(fbResponse);
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
