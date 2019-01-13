import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { Countdown } from 'src/app/shared/models/countdown.model';

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

  constructor() { }

  ngOnInit() {
    this.countDownClock = new Countdown(this.timer).getCountDownClock();
    this.remainingTime = new Countdown(this.timer).calcRemainingTime();
    this.completedTimer = !!this.timer.completedDate;
  }

}
