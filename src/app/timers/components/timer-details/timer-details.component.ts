import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/remaining-time.model';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit, OnDestroy {

  // This asynchronously loads the timer logic only once timer is present
  // Not sure why this is necessary here while not in the timer-card-item component
  @Input()
  set timer(timer: Timer) {
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
  countDownClock: CountDownClock;
  intervalTicker: NodeJS.Timer;

  constructor(
  ) { }

  ngOnInit() {

  }

  applyTimerValues() {
    // Initialize timer when screen loads
    this.countDownClock = new Countdown(this.timer).getCountDownClock();

    // Increment timer by 1 second
    const step = 1000;
    this.intervalTicker = setInterval(() => {
      this.remainingTime -= 1000;
      this.countDownClock = new Countdown(this.timer).getCountDownClock();
    }, step);
  }

  ngOnDestroy() {
    // Stop timer when navigating away from page
    clearInterval(this.intervalTicker);
  }

}
