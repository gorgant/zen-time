import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { bounceOutLeftAnimation, bounceInLeftAnimation } from 'src/app/shared/animations/timer-animations';
import { trigger, transition, style, animate, useAnimation } from '@angular/animations';
import { UiService } from 'src/app/shared/services/ui.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timer-card-list',
  templateUrl: './timer-card-list.component.html',
  styleUrls: ['./timer-card-list.component.scss'],
  animations: [
    trigger('todoAnimation', [
      transition(':enter', [
        useAnimation(bounceInLeftAnimation, {
          params: {
            duration: '2000ms',
          }
        })
      ]),
      transition(':leave', [
        style({ backgroundColor: 'red' }),
        animate(500),
        useAnimation(bounceOutLeftAnimation)
      ]),
    ])
  ]
})
export class TimerCardListComponent implements OnInit {

  @Input() doneList: boolean;
  @Input() timers: Timer[];
  @Input() loading: boolean;
  @Input() error: any;

  searchContents$: Observable<string>;

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.searchContents$ = this.uiService.searchContents$;
  }
}
