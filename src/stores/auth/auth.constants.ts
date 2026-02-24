import type { AuthState } from './auth.types';

export const AUTH_STORAGE_KEY = 'finance-auth-storage';

export const AUTH_INITIAL_STATE: Pick<
  AuthState,
  'user' | 'token' | 'isAuthenticated' | 'isLoading' | 'error'
> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
