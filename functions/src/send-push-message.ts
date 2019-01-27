import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { now } from 'moment';
admin.initializeApp();
const secureCompare = require('secure-compare');
import {Storage} from '@google-cloud/storage';
const gcs = new Storage();
import * as webpush from 'web-push';


interface PushSubTokenSw {
  endpoint: string;
  expirationTime: any;
  keys: {
    p256dh: string;
    auth: string;
  };
  fsDocId: string;
  fsUserId: string;
}


interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const pushMessage = {
  'notification': {
      'title': 'A Timer is Expiring Soon',
      'body': 'One or more of your zen timers will expire soon.',
      'icon': 'assets/icons/icon-96x96.png',
      'vibrate': [100, 50, 100],
      'data': {
          'dateOfArrival': now(),
          'primaryKey': 1,
          'url': 'https://zentime.me/timers'
      },
      'actions': [{
          'action': 'See Now',
          'title': 'View Timers'
      }]
  }
};

const invalidTokens: PushSubTokenSw[] = [];

export const sendPushMessage = functions.https.onRequest(async (req, res) => {
  const key = req.query.key;

  // Exit if the keys don't match.
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('The key provided in the request does not match the key set in the environment. Check that', key,
        'matches the cron.key attribute in `firebase env:get`');
    res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.');
    return null;
  }

  // Fetch tokens
  const swPushSubTokens = await getSwTokens();

  // Send push message to users
  await sendSwPushMessageToUsers(swPushSubTokens)
    .then(response => {
      // Delete any invalid tokens if they exist
      if (invalidTokens.length > 0) {
        batchRemoveInvalidTokens(invalidTokens);
      }
      // If no push messages, log that and exit
      if (typeof response === 'string') {
        console.log('No push messages to send.', res)
        return res.status(200).json({message: 'No push messages to send.'})
      }
      console.log('Push messages successfully sent.', res)
      return res.status(200).json({message: 'Newsletter sent successfully.'})
    })
    .catch(err => {
      console.error("Error sending push notifications, reason: ", err);
      res.sendStatus(500);
  });

  return null;
})

// Get a list of tokens for users who have one or more timers that are due within an hour
async function getSwTokens(): Promise<PushSubTokenSw[]> {
  // First fetch matching users
  const users = await getUsersWithValidTimers();

  // Then grab their tokens
  const userPushSubTokens = await getAllPushSubTokensSw(users);
  
  return userPushSubTokens;
}

// Get a list of users who have unexpired timers that are due within an hour
async function getUsersWithValidTimers(): Promise<string[]> {
  const usersRef = admin.firestore().collection('users');
  const usersQuerySnapshot = await usersRef.get();
  // Instead of using forEach, use the docs method which returns an array I can map (or reduce)
  const usersDocArray = usersQuerySnapshot.docs;
  // Need to use a reduce function here (vs map) to be able to filter out undefined results from uiserIdArray
  // Courtesy of: https://gyandeeps.com/array-reduce-async-await/
  const userIdArray: Promise<string[]> = usersDocArray.reduce(async (acc: Promise<string[]>, userSnapshot) => {
    // This collection is required to resolve the acc promise in the async
    const collection: string[] = await acc;
    const userId = userSnapshot.id;
    const cutoff = now() + (1000 * 60 * 60);
    const timerRef = usersRef.doc(userId).collection('timers');
    const targetTimersQuery = timerRef.where('dueDate', '>', now()).where('dueDate', '<', cutoff);
    const targetTimersSnapshot = await targetTimersQuery.get();
    // Only push to results if at least one valid timer is identified
    if (!targetTimersSnapshot.empty) {
      collection.push(userId);
    }
    return collection;
  }, Promise.resolve([]));

  return userIdArray;
}

// Get a list of push sub tokens for a specific user
async function getUserPushSubTokensSw(userId: string): Promise<PushSubTokenSw[]> {
  const userPushSubTokens: PushSubTokenSw[] = [];
  const usersRef = admin.firestore().collection('users');
  const userPushSubTokensRef = usersRef.doc(userId).collection('pushSubTokensSw');
  const userPushSubTokensSnapshot = await userPushSubTokensRef.get();
  userPushSubTokensSnapshot.forEach(async tokenSnapshot => {
    const token: PushSubTokenSw = {
      ... await tokenSnapshot.data() as PushSubTokenSw,
      fsDocId: tokenSnapshot.id,
      fsUserId: userId
    } 
    userPushSubTokens.push(token);
  });
  return userPushSubTokens;
}

// Compile the complete list of sub tokens across all target users
async function getAllPushSubTokensSw(userIdList: string[]): Promise<PushSubTokenSw[]> {
  const promiseArray = userIdList.map(async userId => {
      const uTokens = await getUserPushSubTokensSw(userId);
      return uTokens;
    });

  const results = await Promise.all(promiseArray);

  // This flattens the array of arrays into a single array
  const flatResults: PushSubTokenSw[] = ([] as PushSubTokenSw[]).concat.apply([], results);

  return flatResults;
}

async function sendSwPushMessageToUsers(pushSubTokens: PushSubTokenSw[]): Promise<webpush.SendResult[] | string> {
  const vapidPublicKey = 'BN_GrpVFBKooWXhTi0Cx0E4k6tAQ3fGKjY_boGy7crz6jMrYrIUdyV3jbGWID3P-vBiUXfHWoRy89Str_Gl9Nxw';
  const vapidPrivateKey = await getVapidPrivateKey();

  webpush.setVapidDetails(
    'mailto:example@zentime.me',
    vapidPublicKey,
    vapidPrivateKey
  );
  
  if (pushSubTokens.length > 0) {
      return Promise.all(pushSubTokens.map(
        sub => webpush.sendNotification(
          sub, JSON.stringify(pushMessage)
        ).catch(err => {
          console.log(`Push message failed, pushId ${sub.fsDocId}`);
          invalidTokens.push(sub);
          return err;
        })
    ))
  } else {
    return 'No push messages to send. Exiting with no action.';
  }
}

async function getVapidPrivateKey(): Promise<string> {
  const keyFile: VapidKeys = await fetchKeyData();
  const privateKey = keyFile.privateKey;
  return privateKey;
}

// Get the vapid keys from Cloud Storage
async function fetchKeyData(): Promise<VapidKeys> {
  const bucket = gcs.bucket('gorgant-zentime.appspot.com'); // The Storage bucket that contains the file.
  const filePath = 'messaging/vapid/zentime_vapid_keys.json'; // File path in the bucket.
  const fileData: Buffer[] = await bucket.file(filePath).download(); // Get the file data
  const fileAsString = fileData.toString(); // Convert the file to a string
  const jsonObj: VapidKeys = JSON.parse(fileAsString); // Convert the string to JSON
  return jsonObj;
}

function batchRemoveInvalidTokens(invalTokens: PushSubTokenSw[]) {
  const batch = admin.firestore().batch();
  invalTokens.map(token => {
    console.log('Adding invalid token to batch', token.fsDocId);
    const tokenRef = getInvalidToken(token);
    batch.delete(tokenRef);
  })
  console.log('About to execut batch commit');
  batch.commit()
    .then(result => console.log('Batch removal complete', result))
    .catch(err => console.log('Error with batch delete', err));
}

function getInvalidToken(token: PushSubTokenSw) {
  const usersRef = admin.firestore().collection('users');
  const userPushSubTokensRef = usersRef.doc(token.fsUserId).collection('pushSubTokensSw');
  const targetTokenRef = userPushSubTokensRef.doc(token.fsDocId)
  console.log('Returning this invalid token ref', targetTokenRef);
  return targetTokenRef;
}
