import { RemainingTime } from './remaining-time.model';

export class Countdown {

  constructor(private remainingTime) {}

  getTimeRemaining(): RemainingTime {
    const t = this.remainingTime;
    const seconds = Math.floor( (t / 1000) % 60 );
    const minutes = Math.floor( (t / 1000 / 60) % 60 );
    const hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
    const days = Math.floor( t / (1000 * 60 * 60 * 24) % 7 );
    const weeks = Math.floor( t / (1000 * 60 * 60 * 24 * 7) );

    const remainingTime: RemainingTime = {
      'total': t,
      'weeks': weeks,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
    return remainingTime;
  }
}
