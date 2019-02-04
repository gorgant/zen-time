import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreActions } from 'src/app/root-store';

@Component({
  selector: 'app-timer-card-item',
  templateUrl: './timer-card-item.component.html',
  styleUrls: ['./timer-card-item.component.scss']
})
export class TimerCardItemComponent implements OnInit {

  @Input() timer: Timer;
  countDownClock: CountDownClock;
  remainingTime: number;
  completedTimer: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.completedTimer = !!this.timer.completedDate;
    // Only generate countdown clocks (which is expensive) if this is not a completed timer
    if (!this.completedTimer) {
      this.countDownClock = new Countdown(this.timer).getCountDownClock();
      this.remainingTime = new Countdown(this.timer).calcRemainingTime();
    }
  }

  onCompleteTimer() {
    this.store$.dispatch(new TimerStoreActions.MarkTimerDone({timer: this.timer}));
  }

}
