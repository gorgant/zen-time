import { AppUser } from 'src/app/shared/models/app-user.model';

export interface State {
  user: AppUser | null;
  isLoading: boolean;
  profileImageLoading: boolean;
  error?: any;
  userLoaded: boolean;
}

export const initialState: State = {
  user: null,
  isLoading: false,
  profileImageLoading: false,
  error: null,
  userLoaded: false,
};
