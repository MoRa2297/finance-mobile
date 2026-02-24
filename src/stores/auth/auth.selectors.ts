import { AuthState } from '@stores/auth/auth.types';

export const authSelectors = {
  user: (state: AuthState) => state.user,
  token: (state: AuthState) => state.token,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isLoading: (state: AuthState) => state.isLoading,
  error: (state: AuthState) => state.error,
  fullName: (state: AuthState) =>
    state.user ? `${state.user.name} ${state.user.surname}` : null,
};
