import { Action } from '@ngrx/store';
import { UndoableAction } from 'src/app/shared/models/undoable-action.model';

export enum ActionTypes {
  STASH_UNDOABLE_ACTION = '[Undo Store] Stash Undoable Action',
  PURGE_UNDOABLE_ACTION = '[Undo Store] Purge Undoable Action'
}

export class StashUndoableAction implements Action {
  readonly type = ActionTypes.STASH_UNDOABLE_ACTION;
  constructor (public payload: { undoableAction: UndoableAction}) {}
}

export class PurgeUndoableAction implements Action {
  readonly type = ActionTypes.PURGE_UNDOABLE_ACTION;
  constructor (public payload: { undoableAction: UndoableAction}) {}
}

export type Actions =
  StashUndoableAction |
  PurgeUndoableAction
  ;
