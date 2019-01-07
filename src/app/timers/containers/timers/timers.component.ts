import { Component, OnInit } from '@angular/core';
import { RootStoreState } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Timer } from '../../models/timer.model';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit {
  timers$: Observable<Timer[]>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private timerService: TimerService
  ) { }

  ngOnInit() {
    this.timers$ = this.timerService.fetchTimers();
  }

}
