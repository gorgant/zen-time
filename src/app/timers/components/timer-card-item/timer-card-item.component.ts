import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { now } from 'moment';
import { RemainingTime } from 'src/app/shared/models/remaining-time.model';
import { Countdown } from 'src/app/shared/models/countdown.model';

@Component({
  selector: 'app-timer-card-item',
  templateUrl: './timer-card-item.component.html',
  styleUrls: ['./timer-card-item.component.scss']
})
export class TimerCardItemComponent implements OnInit {

  @Input() timer: Timer;
  remainingTime: number;
  remainingTimeTracker: RemainingTime;

  constructor() { }

  ngOnInit() {
    const elapsedTime = now() - this.timer.createdDate;
    this.remainingTime = this.timer.duration - elapsedTime;

    this.remainingTimeTracker = new Countdown(this.remainingTime).getTimeRemaining();

  }

}
