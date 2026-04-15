import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';

export type TLoginFormValues = {
  email: string;
  password: string;
};

export const useLoginScreen = () => {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleLogin = useCallback(
    async (values: TLoginFormValues) => {
      try {
        await login(values.email, values.password);
        router.replace(ROUTES.HOME);
      } catch {
        // Errore già in state.error
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
