import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { Router, ActivatedRoute } from '@angular/router';

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
    // Set timer type once timer is available
    if (timer && !this.timerLoaded) {
      this.setTimerType();
      this.timerLoaded = true; // This prevents additional tickers from firing when edit dialogue is closed
    }
    // If timer is deleted on separate client, navigate away from the timer details
    if (!timer && this.timerLoaded) {
      this.exitTimerDetails();
    }
  }
  private _timer: Timer;
  get timer(): Timer { return this._timer; }

  @Input() loading: boolean;
  @Input() error: any;
  timerLoaded: boolean;
  completedTimer: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  private setTimerType(): void {
    this.completedTimer = !!this.timer.completedDate;
  }

  private exitTimerDetails() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
