import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingTimePipe'
})
export class RemainingTimePipe implements PipeTransform {

  transform(value: number): string {
    const days = Math.round((value / (1000 * 60 * 60 * 24)) % 7);
    const weeks = Math.round(value / (1000 * 60 * 60 * 24 * 7));
    if (weeks > 0) {
      return `${weeks} Weeks, ${days} Days`;
    } else {
      return `${days} Days`;
    }
  }

}
