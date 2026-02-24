import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authService } from '@/services';

import type { AuthState, RegisterPayload, User } from './auth.types';
import { AUTH_INITIAL_STATE, AUTH_STORAGE_KEY } from './auth.constants';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ─── State ───────────────────────────────────────────────────────────
      ...AUTH_INITIAL_STATE,

      // ─── Actions ─────────────────────────────────────────────────────────

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authService.login(
            email,
            password,
          );
          const { token: _, ...cleanUser } = user;

          set({
            user: cleanUser,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authService.register(payload);
          const { token: _, ...cleanUser } = user;

          set({
            user: cleanUser,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: () => {
        set(AUTH_INITIAL_STATE);
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) set({ user: { ...currentUser, ...updates } });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(AUTH_INITIAL_STATE);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => {
        console.log('AUTH_STORAGE_KEY: ', state);
        return {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        };
      },
    },
  ),
);
