import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, Subject, throwError } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StoreUserDataType } from '../models/store-user-data-type.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private imageUploadPercentage$: Observable<number>;
  downloadUrlSubject = new Subject<string>();

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private uiService: UiService,
    private authService: AuthService,
  ) { }

  fetchUserData(userId: string): Observable<AppUser> {
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
          // Mark new user false bc at this point demo timer request should have already been fired
          if (appUser.isNewUser) {
            this.storeUserData(appUser, appUser.id, StoreUserDataType.TOGGLE_NEW_USER_OFF);
          }
          return appUser;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  storeUserData(appUser: AppUser, userId: string, requestType: StoreUserDataType): Observable<AppUser> {
    const userData: AppUser = appUser;
    if (requestType === StoreUserDataType.REGISTER_USER) {
      userData.id = userId;
    }
    if (requestType === StoreUserDataType.TOGGLE_NEW_USER_OFF) {
      userData.isNewUser = false;
    }
    const userCollection = this.db.collection<AppUser>('users');
    const fbResponse = userCollection.doc(userId).set(appUser, {merge: true})
      .then(() => {
        if (
          requestType !== StoreUserDataType.REGISTER_USER &&
          requestType !== StoreUserDataType.GOOGLE_LOGIN &&
          requestType !== StoreUserDataType.EMAIL_UPDATE &&
          requestType !== StoreUserDataType.TOGGLE_NEW_USER_OFF
        ) {
          this.uiService.showSnackBar('User info updated', null, 3000);
        }
        return appUser;
      } )
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  uploadProfileImage(imageFile: Blob, appUser: AppUser): Observable<string> {
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

  fetchDownloadUrl(appUser: AppUser): Observable<string> {
    const filePath = `graphics/user-profile-images/${appUser.id}/profileImage`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }



  // Provides easy access to user doc throughout the app
  fetchUserDoc(userId: string) {
    return this.db.doc<AppUser>(`users/${userId}`);
  }

  get imageUploadPercentage() {
    return this.imageUploadPercentage$;
  }
}
