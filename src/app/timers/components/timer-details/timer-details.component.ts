import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit {

  @Input() timer: Timer;
  @Input() loading: boolean;
  @Input() error: any;
  countDownClock: CountDownClock;
  intervalTicker: NodeJS.Timer;

  constructor(
  ) { }

  ngOnInit() {

  }

}
