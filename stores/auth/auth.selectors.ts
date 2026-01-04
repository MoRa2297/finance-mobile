import type { AuthState } from './auth.types';

export const authSelectors = {
    user: (state: AuthState) => state.user,
    isAuthenticated: (state: AuthState) => state.isAuthenticated,
    isLoading: (state: AuthState) => state.isLoading,
    error: (state: AuthState) => state.error,
    token: (state: AuthState) => state.user?.token ?? null,
    fullName: (state: AuthState) =>
        state.user ? `${state.user.name} ${state.user.surname}` : null,
};


