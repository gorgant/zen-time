// import { RemainingTime } from './remaining-time.model';

// export class Countdown {

//   constructor(private remainingTime) {}

//   getTimeRemaining(): RemainingTime {
//     const t = this.remainingTime;
//     const seconds = Math.floor( (t / 1000) % 60 );
//     const minutes = Math.floor( (t / 1000 / 60) % 60 );
//     const hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
//     const days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
//     const weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

//     const remainingTime: RemainingTime = {
//       'total': t,
//       'weeks': weeks,
//       'days': days,
//       'hours': hours,
//       'minutes': minutes,
//       'seconds': seconds
//     };
//     return remainingTime;
//   }
// }

import { CountDownClock } from './remaining-time.model';
import { now } from 'moment';
import { Timer } from 'src/app/timers/models/timer.model';

export class Countdown {

  constructor(private timer: Timer) { }

  getCountDownClock(): CountDownClock {
    const t = this.calcRemainingTime();
    const seconds = Math.floor( (t / 1000) % 60 );
    const minutes = Math.floor( (t / 1000 / 60) % 60 );
    const hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
    const days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
    const weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

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

  private calcRemainingTime(): number {
    const elapsedTime = now() - this.timer.createdDate;
    const remainingTime = this.timer.duration - elapsedTime;
    return remainingTime;
  }
}
