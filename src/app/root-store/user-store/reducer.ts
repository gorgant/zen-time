import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.USER_DATA_REQUESTED:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ActionTypes.USER_DATA_LOADED:
      return {
        user: action.payload.userData,
        isLoading: false,
        error: null,
        userLoaded: true,
      };
    case ActionTypes.STORE_USER_DATA_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.UPDATE_PASSWORD_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.UPDATE_PROFILE_IMAGE_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.PUSH_SUB_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.STORE_PUSH_SUB_TOKEN_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.USER_DATA_LOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}
