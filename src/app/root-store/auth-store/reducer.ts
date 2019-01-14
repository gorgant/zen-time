import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true
      };
    case ActionTypes.SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    default: {
      return state;
    }
  }
}
