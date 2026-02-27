import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { ProfileForm } from '@components/screens/settings/profile/ProfileForm/ProfileForm';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { Header } from '@components/ui/Header';

export default function ProfileScreen() {
  const { t } = useTranslation(['profilePage', 'common']);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'icon' }}
        center={{ type: 'title', title: t('profilePage:headerTitle') }}
      />
      <ProfileForm />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
});
