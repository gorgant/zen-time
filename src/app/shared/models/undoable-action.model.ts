import { Actions as TimerActions } from 'src/app/root-store/done-store/actions';
import { Actions as DoneActions } from 'src/app/root-store/done-store/actions';

export interface UndoableAction {
  payload: any;
  actionId: string;
  actionType: string;
}
