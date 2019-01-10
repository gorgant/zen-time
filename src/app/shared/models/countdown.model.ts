import { CountDownClock } from './count-down-clock.model';
import { now } from 'moment';
import { Timer } from 'src/app/timers/models/timer.model';

export class Countdown {

  constructor(private timer: Timer) { }

  getCountDownClock(): CountDownClock {
    const t = this.calcRemainingTime();

    let seconds = Math.floor( (t / 1000) % 60 );
    let minutes = Math.floor( (t / 1000 / 60) % 60 );
    let hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
    let days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
    let weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

    // Avoid confusing displays like 0 Hours if there are still Days left
    if (seconds === 0 && minutes > 0) { minutes -= 1; seconds = 60; }
    if (minutes === 0 && hours > 0) { hours -= 1; minutes = 60; }
    if (hours === 0 && days > 0) { days -= 1; hours = 24; }
    if (days === 0 && weeks > 0) { weeks -= 1; days = 7; }

    const remainingTime: CountDownClock = {
      'total': t,
      'weeks': weeks,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
    return remainingTime;
  }

  calcRemainingTime(): number {
    const elapsedTime = now() - this.timer.createdDate;
    const remainingTime = this.timer.duration - elapsedTime;
    return remainingTime;
  }
}
