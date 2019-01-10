import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';
import { now } from 'moment';

export const featureAdapter: EntityAdapter<Timer>
  = createEntityAdapter<Timer>(
    {
      selectId: (timer: Timer) => timer.id,
      sortComparer: (a: Timer, b: Timer): number => {
        const remainingTimeA = calcRemainingTime(a);
        const remainingTimeB = calcRemainingTime(b);
        return remainingTimeA.toString().localeCompare(remainingTimeB.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<Timer> {
  isLoading?: boolean;
  error?: any;
  timersLoaded?: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    timersLoaded: false,
  }
);

// Helper function for sortComparer
function calcRemainingTime(timer: Timer): number {
  const elapsedTime = now() - timer.setOnDate;
  return timer.duration - elapsedTime;
}
