import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.STASH_UNDOABLE_ACTION: {
      // Upsert here b/c ID carries over switching from timer to done
      return featureAdapter.upsertOne(
        action.payload.undoableAction, state
      );
    }

    case ActionTypes.PURGE_UNDOABLE_ACTION: {
      return featureAdapter.removeOne(
        action.payload.undoableAction.actionId, state
      );
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
