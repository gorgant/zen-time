export interface State {
  isAuthenticated: boolean;
  error?: any;
}

export const initialState: State = {
  isAuthenticated: false,
  error: null
};
