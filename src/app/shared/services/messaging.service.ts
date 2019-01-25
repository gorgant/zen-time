import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AppUser } from '../models/app-user.model';
import { SwPush } from '@angular/service-worker';
import { PushSubTokenSw } from '../models/push-sub-token-sw.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { PushSubTokenFcm } from '../models/push-sub-token-fcm.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);


  constructor(
    private afMessaging: AngularFireMessaging,
    private uiService: UiService,
    private swPush: SwPush,
    private db: AngularFirestore,
    private userService: UserService
  ) {
    // this.afMessaging.messaging
    //   .subscribe(messaging => {
    //     messaging.onMessage = messaging.onMessage.bind(messaging);
    //     messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    //   }
    // );
}

  // Request permission for notification from firebase cloud messaging
  // Store this token in the user's profile
  requestFcmPushSubscription(appUser: AppUser): Observable<PushSubTokenFcm> {
    return this.afMessaging.requestToken
      .pipe(
        map(token => {
          const pushSub: PushSubTokenFcm = {
            token: token
          };
          return pushSub;
        } ),
        catchError(error => {
          // If user replies no, need to pass that to the error handler and update the user store
          // ENTER CODE HERE
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  // Hook method when new notification received in foreground
  receiveMessage() {
    this.afMessaging.messages
      .subscribe(payload => {
        console.log('new message received. ', payload);
        this.currentMessage.next(payload);
      });
  }

  requestSwPushSubscription(publicKey: string): Observable<PushSubTokenSw> {
    const swResponse = this.swPush.requestSubscription({
      serverPublicKey: publicKey
    })
      .then(sub => {
        const pushSub: PushSubTokenSw = {
          endpoint: sub.endpoint,
          expirationTime: sub.expirationTime,
          keys: {
            p256dh: sub.toJSON().keys.p256dh,
            auth: sub.toJSON().keys.auth
          }
        };
        return pushSub;
      })
      .catch(error => {
        console.log(error);
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });

    return from(swResponse);
  }

  storePushSubToken(pushSub: PushSubTokenSw | PushSubTokenFcm): Observable<PushSubTokenSw | PushSubTokenFcm> {
    const tokenId = this.db.createId();
    let tokenDoc: AngularFirestoreDocument;
    if ('keys' in pushSub) {
      tokenDoc = this.getSwPushSubTokenCollection().doc(tokenId);
    } else {
      tokenDoc = this.getFcmPushSubTokenCollection().doc(tokenId);
    }
    const fbResponse = tokenDoc.set(pushSub)
      .then(() => {
        return pushSub;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  private getSwPushSubTokenCollection(): AngularFirestoreCollection<PushSubTokenSw> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const pushSubTokenCollection = userDoc.collection<PushSubTokenSw>('pushSubTokensSw');
    return pushSubTokenCollection;
  }

  private getFcmPushSubTokenCollection(): AngularFirestoreCollection<PushSubTokenFcm> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const pushSubTokenCollection = userDoc.collection<PushSubTokenFcm>('pushSubTokensFcm');
    return pushSubTokenCollection;
  }
}
