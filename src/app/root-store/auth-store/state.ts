import { AppUser } from 'src/app/shared/models/app-user.model';

export interface State {
  user: AppUser | null;
  isAuthenticated: boolean;
}

export const initialState: State = {
  user: null,
  isAuthenticated: false
};
