import { CountDownClock } from './count-down-clock.model';
import { now } from 'moment';
import { Timer } from 'src/app/timers/models/timer.model';

export class Countdown {

  constructor(private timer: Timer) { }

  getCountDownClock(): CountDownClock {
    let t = this.calcRemainingTime();
    let seconds: number;
    let minutes: number;
    let hours: number;
    let days: number;
    let weeks: number;

    if (t > 0) {
      seconds = Math.floor( (t / 1000) % 60 );
      minutes = Math.floor( (t / 1000 / 60) % 60 );
      hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
      days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
      weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

      // Avoid confusing displays like 0 Hours if there are still Days left
      if (seconds === 0 && minutes > 0) { minutes -= 1; seconds = 60; }
      if (minutes === 0 && hours > 0) { hours -= 1; minutes = 60; }
      if (hours === 0 && days > 0) { days -= 1; hours = 24; }
      if (days === 0 && weeks > 0) { weeks -= 1; days = 7; }
    }

    if (t < 0 ) {
      t *= -1;
      seconds = Math.floor( (t / 1000) % 60 );
      minutes = Math.floor( (t / 1000 / 60) % 60 );
      hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
      days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
      weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

      // Avoid confusing displays like 0 Hours if there are still Days left
      if (seconds === 0 && minutes > 0) { minutes -= 1; seconds = 60; }
      if (minutes === 0 && hours > 0) { hours -= 1; minutes = 60; }
      if (hours === 0 && days > 0) { days -= 1; hours = 24; }
      if (days === 0 && weeks > 0) { weeks -= 1; days = 7; }

      t *= -1;
      seconds *= -1;
      minutes *= -1;
      hours *= -1;
      days *= -1;
      weeks *= -1;

    }

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
    const elapsedTime = now() - this.timer.setOnDate;
    const remainingTime = this.timer.duration - elapsedTime;
    return remainingTime;
  }
}
