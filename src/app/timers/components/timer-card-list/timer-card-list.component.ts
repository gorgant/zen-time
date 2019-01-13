import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';

@Component({
  selector: 'app-timer-card-list',
  templateUrl: './timer-card-list.component.html',
  styleUrls: ['./timer-card-list.component.scss']
})
export class TimerCardListComponent implements OnInit {

  @Input() doneList: boolean;
  @Input() timers: Timer[];
  @Input() loading: boolean;
  @Input() error: any;

  constructor() { }

  ngOnInit() {
  }

}
