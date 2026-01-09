import { useState, useCallback } from 'react';

import { useAuthStore } from '@/stores';

import { LoginFormValues } from '@components/screens/login/LoginForm/LoginForm';
import { getAuthErrorMessage, isAuthError } from './helpers';

export interface UseLoginReturn {
  isLoading: boolean;
  errorMessage: string;
  handleLogin: (values: LoginFormValues) => Promise<void>;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = useAuthStore(state => state.login);

  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleLogin = useCallback(
    async (values: LoginFormValues) => {
      try {
        setIsLoading(true);
        clearError();

        await login(values.email, values.password);
        // TODO complete it
        // router.replace('');
      } catch (error) {
        const message = isAuthError(error)
          ? getAuthErrorMessage(error)
          : getAuthErrorMessage({ error: 'UNKNOWN' });

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [login, clearError],
  );

  return {
    isLoading,
    errorMessage,
    handleLogin,
    clearError,
  };
};
