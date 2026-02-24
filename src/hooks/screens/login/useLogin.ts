import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';

export type TLoginFormValues = {
  email: string;
  password: string;
};

export interface UseLoginReturn {
  isLoading: boolean;
  errorMessage: string | null;
  handleLogin: (values: TLoginFormValues) => Promise<void>;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleLogin = useCallback(
    async (values: TLoginFormValues) => {
      try {
        await login(values.email, values.password);
        router.replace('/(auth)/(tabs)');
      } catch (error) {
        // Errore già gestito nello store — state.error aggiornato automaticamente
      }
    },
    [login, router],
  );

  return {
    isLoading,
    errorMessage: error,
    handleLogin,
    clearError,
  };
};
