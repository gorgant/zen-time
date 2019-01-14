import { AppUser } from 'src/app/shared/models/app-user.model';

export interface State {
  isAuthenticated: boolean;
}

export const initialState: State = {
  isAuthenticated: false
};
