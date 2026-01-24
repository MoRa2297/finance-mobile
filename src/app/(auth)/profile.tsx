import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/stores';
import { theme } from '@/config/theme';
import {
  ProfileForm,
  ProfileFormValues,
} from '@components/screens/settings/profile/ProfileForm/ProfileForm';
import { ScreenContainer } from '@components/ui/ScreenContainer';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const handleSubmit = useCallback(
    async (values: ProfileFormValues, _photoBase64?: string) => {
      try {
        setSubmitError(undefined);

        // Update user in store
        // updateUser({
        //   name: values.name,
        //   surname: values.surname,
        //   email: values.email,
        //   imageUrl: values.imageUrl,
        // });
      } catch (error: any) {
        setSubmitError(t('messages.apiErrors.genericError'));
      }
    },
    [updateUser, t],
  );

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/*<Header title={t('screens.profileScreen.headerTitle')} showBackButton />*/}

      <ProfileForm
        user={user}
        onSubmit={handleSubmit}
        submitError={submitError}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
});
