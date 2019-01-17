import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { Timer } from '../../models/timer.model';
import { Countdown } from 'src/app/shared/models/countdown.model';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

  tickerSet: boolean;
  // This asynchronously loads the timer logic only once timer is present
  // Not sure why this is necessary here while not in the timer-card-item component
  @Input()
  set timer(timer: Timer) {
    this._timer = timer;
    if (timer && !this.tickerSet) {
      this.applyTimerValues();
      this.tickerSet = true; // This prevents additional tickers from firing when edit dialogue is closed
    }
  }
  private _timer: Timer;
  get timer(): Timer { return this._timer; }
  countDownClock: CountDownClock;
  intervalTicker: NodeJS.Timer;

  expiredSeconds: boolean;
  expiredMinutes: boolean;
  expiredHours: boolean;
  expiredDays: boolean;


  constructor() { }

  ngOnInit() {
  }

  applyTimerValues() {
    // Initialize timer when screen loads (otherwise ticker doesn't display for 1 second)
    this.countDownClock = new Countdown(this.timer).getCountDownClock();
    this.createTicker();
    if (this.countDownClock.total < 0) {
      this.calculateExpirationLevel();
    }
  }

  private createTicker() {
    // Set interval at 1 second
    const step = 1000;
    // Refresh countdown data each second
    this.intervalTicker = setInterval(() => {
      if (this.countDownClock.total < 0) {
        this.calculateExpirationLevel();
      }
      this.countDownClock = new Countdown(this.timer).getCountDownClock();
    }, step);
  }

  private killTicker(): void {
    clearInterval(this.intervalTicker);
  }

  // Determines what text is displayed for the expired timer
  private calculateExpirationLevel(): void {
    const remainingTime = this.countDownClock.total;
    if (remainingTime < (1000) * -1) {
      this.expiredSeconds = true;
      this.expiredMinutes = false;
      this.expiredHours = false;
      this.expiredDays = false;
    }
    if (remainingTime < (1000 * 60) * -1) {
      this.expiredSeconds = false;
      this.expiredMinutes = true;
      this.expiredHours = false;
      this.expiredDays = false;
    }
    if (remainingTime < (1000 * 60 * 60) * -1) {
      this.expiredSeconds = false;
      this.expiredMinutes = false;
      this.expiredHours = true;
      this.expiredDays = false;
    }
    if (remainingTime < (1000 * 60 * 60 * 24) * -1) {
      this.expiredSeconds = false;
      this.expiredMinutes = false;
      this.expiredHours = false;
      this.expiredDays = true;
    }
  }

  ngOnDestroy() {
    // Stop timer when navigating away from page
    this.killTicker();
  }

}
