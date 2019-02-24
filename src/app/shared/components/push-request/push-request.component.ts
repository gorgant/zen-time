import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, UserStoreActions } from 'src/app/root-store';
import { take } from 'rxjs/operators';
import { VAPID_PUBLIC_KEY } from '../../utils/vapid-key';

@Component({
  selector: 'app-push-request',
  templateUrl: './push-request.component.html',
  styleUrls: ['./push-request.component.scss']
})
export class PushRequestComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
  }

  onSubscribeToNotifications() {
    this.store$.select(UserStoreSelectors.selectAppUser)
    .pipe(take(1))
    .subscribe(user => {
      this.store$.dispatch(new UserStoreActions.PushSubRequested({ userId: user.id, publicKey: this.VAPID_PUBLIC_KEY }));
    });
  }

  onRejectPermission() {
    // Register the user decision
    this.store$.dispatch(new UserStoreActions.SetPushPermission());
  }

}
