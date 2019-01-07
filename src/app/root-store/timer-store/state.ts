import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Timer } from 'src/app/timers/models/timer.model';

export const featureAdapter: EntityAdapter<Timer>
  = createEntityAdapter<Timer>(
    {
      selectId: (timer: Timer) => timer.id
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
