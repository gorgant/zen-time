import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { take } from 'rxjs/operators';

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
  @ViewChild('markDoneButton') markDoneButton: ElementRef;

  constructor(
    private store$: Store<RootStoreState.State>,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.completedTimer = !!this.timer.completedDate;
    // Only generate countdown clocks (which is expensive) if this is not a completed timer
    if (!this.completedTimer) {
      this.countDownClock = new Countdown(this.timer).getCountDownClock();
      this.remainingTime = new Countdown(this.timer).calcRemainingTime();
    }
  }

  onCompleteTimer() {
    // Add this class to make check-mark purple, can't apply to icon directly, must use wrapper div
    this.renderer.addClass(this.markDoneButton.nativeElement, 'mark-done-clicked');

    this.store$.select(UserStoreSelectors.selectAppUser)
      .pipe(take(1))
      .subscribe(appUser => {
        this.store$.dispatch(new TimerStoreActions.MarkTimerDone({userId: appUser.id, timer: this.timer}));
      });
  }

}
