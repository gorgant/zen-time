import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_DONE_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.SINGLE_DONE_LOADED: {
      return featureAdapter.addOne(
        action.payload.timer, {
          ...state,
          isLoading: false,
          error: null
        }
      );
    }

    case ActionTypes.ALL_DONE_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.ALL_DONE_LOADED: {
      return featureAdapter.addAll(
        action.payload.timers, {
          ...state,
          isLoading: false,
          error: null,
          doneLoaded: true,
        }
      );
    }

    case ActionTypes.DONE_LOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.UPDATE_DONE_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.timer,
        state
      );

      case ActionTypes.ADD_DONE_REQUESTED: {
      return {
        ...state,
        processingClientRequest: true
      };
    }

    case ActionTypes.ADD_DONE_COMPLETE:
      return featureAdapter.addOne(
        action.payload.timer,
        {
          ...state,
          processingClientRequest: false
        }
      );

    case ActionTypes.DELETE_DONE_REQUESTED: {
      return {
        ...state,
        processingClientRequest: true
      };
    }

    case ActionTypes.DELETE_DONE_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.timerId,
        {
          ...state,
          processingClientRequest: false
        }
      );

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
