import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { now } from 'moment';

@Component({
  selector: 'app-timer-card-item',
  templateUrl: './timer-card-item.component.html',
  styleUrls: ['./timer-card-item.component.scss']
})
export class TimerCardItemComponent implements OnInit {

  @Input() timer: Timer;
  remainingTime: number;

  constructor() { }

  ngOnInit() {
    const elapsedTime = now() - this.timer.createdDate;
    this.remainingTime = this.timer.duration - elapsedTime;
  }

}
