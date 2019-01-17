import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

export const selectUndoState: MemoizedSelector<object, State>
= createFeatureSelector<State>('undo');

export const selectUndoById: (actionId: string) => MemoizedSelector<object, UndoableAction>
= (actionId: string) => createSelector(
  selectUndoState,
  undoState => undoState.entities[actionId]
);
