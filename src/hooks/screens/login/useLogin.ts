import { useState, useCallback } from 'react';

import { useAuthStore } from '@/stores';

import { getAuthErrorMessage, isAuthError } from './helpers';
export type TLoginFormValues = {
  email: string;
  password: string;
};

export interface UseLoginReturn {
  isLoading: boolean;
  errorMessage: string;
  handleLogin: (values: TLoginFormValues) => Promise<void>;
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
    async (values: TLoginFormValues) => {
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
