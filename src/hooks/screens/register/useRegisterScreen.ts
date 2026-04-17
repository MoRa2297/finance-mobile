import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@config/constants';

export type TRegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export const useRegisterScreen = () => {
  const router = useRouter();
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleRegister = useCallback(
    async (values: TRegisterFormValues) => {
      try {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
          surname: '', // not collected at registration — editable in profile
          acceptedTerms: true,
        });
        router.replace(ROUTES.HOME);
      } catch {
        // Error already in state.error
      }
    },
    [register, router],
  );

  return {
    isLoading,
    errorMessage: error,
    handleRegister,
    clearError,
  };
};
