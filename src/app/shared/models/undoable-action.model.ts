export interface UndoableAction {
  payload: any;
  actionId: string;
  actionType: string;
}
