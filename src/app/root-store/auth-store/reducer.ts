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
        user: null,
        isAuthenticated: false
      };
    case ActionTypes.LOAD_USER:
      return {
        ...state,
        user: action.payload.user
      };
    default: {
      return state;
    }
  }
}
