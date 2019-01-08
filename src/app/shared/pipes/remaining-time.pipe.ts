import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingTimePipe'
})
export class RemainingTimePipe implements PipeTransform {

  transform(remainingTime: number): string {
    const days = Math.round((remainingTime / (1000 * 60 * 60 * 24)) % 7);
    const weeks = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 7));
    if (weeks > 0) {
      return `${weeks} Weeks, ${days} Days`;
    } else {
      return `${days} Days`;
    }
  }

}
