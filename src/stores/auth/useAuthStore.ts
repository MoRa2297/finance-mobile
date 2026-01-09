import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthState, User } from '@/stores';
import { AUTH_STORAGE_KEY, AUTH_INITIAL_STATE } from '@/stores';

type SetState = (partial: Partial<AuthState>) => void;

/**
 * Performs user login.
 */
const login =
  (set: SetState) =>
  async (email: string, password: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const user = await mockLogin(email, password);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'login error';
      set({ isLoading: false, error: message });
      throw error;
    }
  };

/**
 * Performs user logout.
 */
const logout = (set: SetState) => (): void => {
  set(AUTH_INITIAL_STATE);
};

/**
 * Sets user manually.
 */
const setUser =
  (set: SetState) =>
  (user: User): void => {
    set({ user, isAuthenticated: true, error: null });
  };

/**
 * Clears current error.
 */
const clearError = (set: SetState) => (): void => {
  set({ error: null });
};

/**
 * Resets store to initial state.
 */
const reset = (set: SetState) => (): void => {
  set(AUTH_INITIAL_STATE);
};

/**
 * Authentication store.
 * Automatically persists to AsyncStorage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      ...AUTH_INITIAL_STATE,

      // Actions
      login: login(set),
      logout: logout(set),
      setUser: setUser(set),
      clearError: clearError(set),
      reset: reset(set),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * Mock login for development.
 * TODO: Remove when API is ready.
 */
async function mockLogin(email: string, _password: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: 1,
    email,
    password: '',
    name: 'Test',
    surname: 'User',
    birthDate: new Date('1990-01-01'),
    sex: 'M',
    imageUrl: '',
    acceptedTerms: true,
    token: 'mock-jwt-token',
    updateDate: new Date(),
    createdDate: new Date(),
  };
}
