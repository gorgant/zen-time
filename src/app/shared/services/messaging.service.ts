import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { UiService } from './ui.service';
import { AppUser } from '../models/app-user.model';
import { SwPush } from '@angular/service-worker';
import { PushSubTokenSw } from '../models/push-sub-token-sw.model';
import { PushSubTokenFcm } from '../models/push-sub-token-fcm.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);


  constructor(
    private uiService: UiService,
    private swPush: SwPush,
    private db: AngularFirestore,
    private userService: UserService,
  ) { }

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
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });

    return from(swResponse);
  }

  storePushSubToken(userId: string, pushSub: PushSubTokenSw | PushSubTokenFcm): Observable<PushSubTokenSw | PushSubTokenFcm> {
    const tokenId = this.db.createId();
    let tokenDoc: AngularFirestoreDocument;
    if ('keys' in pushSub) {
      // Generate token with the auth as the ID (so if user adds multiple times, it doesn't add duplicates)
      tokenDoc = this.getSwPushSubTokenCollection(userId).doc(pushSub.keys.auth);
    } else {
      tokenDoc = this.getFcmPushSubTokenCollection(userId).doc(tokenId);
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

  private getSwPushSubTokenCollection(userId: string): AngularFirestoreCollection<PushSubTokenSw> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.fetchUserDoc(userId);
    const pushSubTokenCollection = userDoc.collection<PushSubTokenSw>('pushSubTokensSw');
    return pushSubTokenCollection;
  }

  private getFcmPushSubTokenCollection(userId: string): AngularFirestoreCollection<PushSubTokenFcm> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.fetchUserDoc(userId);
    const pushSubTokenCollection = userDoc.collection<PushSubTokenFcm>('pushSubTokensFcm');
    return pushSubTokenCollection;
  }
}
