import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { now } from 'moment';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { RemainingTime } from 'src/app/shared/models/remaining-time.model';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit, OnDestroy {

  @Input()
  set timer(timer: Timer) {
    console.log('timer set', timer);
    this._timer = timer;
    if (timer) {
      this.applyTimerValues();
    }
  }
  private _timer: Timer;
  get timer(): Timer { return this._timer; }

  @Input() loading: boolean;
  @Input() error: any;
  remainingTime: number;
  remainingTimeTracker: RemainingTime;
  intervalTicker: NodeJS.Timer;

  constructor(
  ) { }

  ngOnInit() {

  }

  applyTimerValues() {
    const elapsedTime = now() - this.timer.createdDate;
    this.remainingTime = this.timer.duration - elapsedTime;

    const step = 1000;
    this.intervalTicker = setInterval(() => {
      this.remainingTime -= 1000;
      this.remainingTimeTracker = new Countdown(this.remainingTime).getTimeRemaining();
    }, step);
  }

  ngOnDestroy() {
    // Stop timer when navigating away from page
    clearInterval(this.intervalTicker);
  }

}
