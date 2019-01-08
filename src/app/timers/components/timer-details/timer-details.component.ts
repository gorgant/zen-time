import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss']
})
export class TimerDetailsComponent implements OnInit {

  @Input() timer: Timer;
  @Input() loading: boolean;
  @Input() error: any;


  constructor(

  ) { }

  ngOnInit() {
    if (this.loading) {
      console.log('loading, spinner should show');
    }
  }

}
