import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_TIMER_LOADED: {
      return featureAdapter.addOne(
        action.payload.timer,
        state
      );
    }

    case ActionTypes.ALL_TIMERS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.ALL_TIMERS_LOADED: {
      return featureAdapter.addAll(action.payload.items, {
        ...state,
        isLoading: false,
        error: null,
        timersLoaded: true,
      });
    }
    case ActionTypes.TIMER_LOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}

// Exporting a variety of selectors in the form of a object from the entity adapter
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = featureAdapter.getSelectors();
