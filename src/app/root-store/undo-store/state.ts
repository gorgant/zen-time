import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

export const featureAdapter: EntityAdapter<UndoableAction>
  = createEntityAdapter<UndoableAction>({
    selectId: (action: UndoableAction) => action.actionId
  });

export interface State extends EntityState<UndoableAction> {

}

export const initialState: State = featureAdapter.getInitialState();
