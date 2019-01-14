import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit {

  // This asynchronously loads the timer logic only once timer is present
  // Not sure why this is necessary here while not in the timer-card-item component
  @Input()
  set timer(timer: Timer) {
    this._timer = timer;
    if (timer && !this.timerLoaded) {
      this.setTimerType();
      this.timerLoaded = true; // This prevents additional tickers from firing when edit dialogue is closed
    }
  }
  private _timer: Timer;
  get timer(): Timer { return this._timer; }

  @Input() loading: boolean;
  @Input() error: any;
  timerLoaded: boolean;
  completedTimer: boolean;

  constructor(
  ) { }

  ngOnInit() {
  }

  private setTimerType (): void {
    this.completedTimer = !!this.timer.completedDate;
  }

}
