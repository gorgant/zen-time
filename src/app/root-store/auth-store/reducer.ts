import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.REGISTER_USER_COMPLETE:
      return {
        ...state,
        isAuthenticated: true
      };
    case ActionTypes.AUTHENTICATION_COMPLETE:
      return {
        ...state,
        isAuthenticated: true
      };
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    case ActionTypes.SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    case ActionTypes.UPDATE_EMAIL_COMPLETE:
      return state;
    case ActionTypes.UPDATE_PASSWORD_COMPLETE:
      return state;
    case ActionTypes.AUTH_LOAD_ERROR:
      return {
        ...state,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}
