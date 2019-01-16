import { Pipe, PipeTransform } from '@angular/core';
import { Timer } from '../models/timer.model';

@Pipe({
  name: 'timerFilter'
})
export class TimerFilterPipe implements PipeTransform {

  transform(timers: Timer[], searchText: string): any[] {

    if (!timers) {
      return [];
    }

    if (!searchText) {
      return timers;
    }

    const cleanSearchText = searchText.toLowerCase().trim();

    return timers.filter(timer =>
      Object.keys(timer).some(key => {
        if ((key === 'title' || key === 'category' || key === 'notes' ) && timer[key] != null) {
          const value: string = timer[key].toString().toLowerCase().trim();
          return value.includes(cleanSearchText);
        }
      })
    );


  }

}
