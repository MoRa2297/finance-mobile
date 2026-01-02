export const AUTH_STORAGE_KEY = 'finance-auth-storage';

export const AUTH_INITIAL_STATE = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
} as const;
