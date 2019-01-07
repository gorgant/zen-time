import { Injectable } from '@angular/core';
import { Timer } from 'src/app/timers/models/timer.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TimerImporterService {

  private dataList: Timer[] = [
    {
      title: 'Replace toothbrush',
      category: 'Personal Care',
      createdDate: 1546830102699,
      notes: `Purchased on Amazon, check for deals on the Sonicare diamondclean, shouldn't cost more than $10 a brush head`,
      duration: 7776000000
    },
    {
      title: 'Fix broken faucet',
      category: 'House Repairs',
      createdDate: 1544821402000,
      notes: `Check with the local hardware store for replacement parts; may need professional assistance`,
      duration: 1123200000
    },
    {
      title: 'Change kitchen sponge',
      category: 'Pantry',
      createdDate: 1545830102699,
      notes: `Typically lasts about this long, give it a sniff test`,
      duration: 4376000000
    },
    {
      title: 'Check protein powder levels',
      category: 'Sports',
      createdDate: 1544320102699,
      notes: `Gotta make sure we don't run out before the next lifting competition brah`,
      duration: 2773050000
    },
    {
      title: 'Clean windows',
      category: 'House Repairs',
      createdDate: 1545130102699,
      notes: `With the increase in pollution, this is getting more and more important`,
      duration: 9746000000
    },
    {
      title: 'Water plants',
      category: 'Gardening',
      createdDate: 1542130102699,
      notes: `Important not to over water these`,
      duration: 3747000000
    },
    {
      title: 'Replace underwear supply',
      category: 'Personal Care',
      createdDate: 1543130102699,
      notes: `These wear out quickly so yeah... keep em fresh`,
      duration: 8746300200
    },
  ];

  private listWithIds: Timer[];

  constructor(
    private afs: AngularFirestore,
    private userService: UserService
  ) { }

  launchImport() {
    this.populateList();
    console.log('list populated', this.listWithIds);
  }

  // Batch import to database
  private populateList() {

    // Optionally add new IDs to items
    this.addIdToItems();

    const batch = this.afs.firestore.batch();
    const dataCollection = this.getItemCollection();

    if (this.listWithIds) {
      this.listWithIds.map(item => {
        const itemRef = dataCollection.ref.doc(item.id);
        batch.set(itemRef, item, {merge: true});
      });
    } else {
      this.dataList.map(item => {
        const itemRef = dataCollection.ref.doc(item.id);
        batch.set(itemRef, item, {merge: true});
      });
      this.listWithIds = this.dataList;
    }

    batch.commit();
  }

  // Assign atuo ids to list items
  private addIdToItems(): void {
    this.listWithIds = this.dataList.map(item => {
      const autoId = this.afs.createId();
      const itemWithId: Timer = {
        id: autoId,
        ...item
      };
      return itemWithId;
    });
  }

  private getItemCollection(): AngularFirestoreCollection<Timer> {
    const userDoc: AngularFirestoreDocument<AppUser> = this.userService.userDoc;
    const timerCollection = userDoc.collection<Timer>('timers');
    return timerCollection;
  }
}
