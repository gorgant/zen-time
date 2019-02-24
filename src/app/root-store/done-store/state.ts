import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';

export const featureAdapter: EntityAdapter<Timer>
  = createEntityAdapter<Timer>(
    {
      selectId: (timer: Timer) => timer.id,
      // Sort by completed date
      sortComparer: (a: Timer, b: Timer): number => {
        const completedDateA = a.completedDate;
        const completedDateB = b.completedDate;
        return completedDateA.toString().localeCompare(completedDateB.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<Timer> {
  isLoading?: boolean;
  error?: any;
  doneLoaded?: boolean;
  processingClientRequest: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    doneLoaded: false,
    processingClientRequest: false,
  }
);
