import { ActionReducer, MetaReducer } from '@ngrx/store';
import { ActionTypes } from './auth-store/actions';

// This metareducer clears store on logout
export function clearStore(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    if (action.type === ActionTypes.SET_UNAUTHENTICATED) {
      state = undefined;
    }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearStore];
