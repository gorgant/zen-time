import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.APP_ONLINE:
      return {
        ...state,
        isOnline: true
      };
    case ActionTypes.APP_OFFLINE:
      return {
        ...state,
        isOnline: false
      };
    default: {
      return state;
    }
  }
}
