import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/stores';
import { ProfileFormValues } from '@components/screens/settings/profile/ProfileForm/ProfileForm';

export const useProfileScreen = () => {
  const { t } = useTranslation(['profilePage', 'common']);

  // Store data
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  // Local state
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleSubmit = useCallback(
    async (values: ProfileFormValues, _photoBase64?: string) => {
      try {
        setIsSubmitting(true);
        setSubmitError(undefined);

        // updateUser({
        //   name: values.name,
        //   surname: values.surname,
        //   email: values.email,
        //   imageUrl: values.imageUrl,
        // });
      } catch (error: any) {
        setSubmitError(t('common:errors.generic'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateUser, t],
  );

  return {
    // Data
    user,

    // State
    submitError,
    isSubmitting,

    // Handlers
    handleSubmit,
  };
};
