import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { Header } from '@components/ui/Header';
import { useProfileScreen } from '@hooks/screens/profile';
import { ProfileForm } from '@components/screens/settings/profile/ProfileForm/ProfileForm';

export default function ProfileScreen() {
  const { t } = useTranslation('profilePage');
  const profileScreen = useProfileScreen();

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'icon' }}
        center={{ type: 'title', title: t('profilePage:headerTitle') }}
      />
      <ProfileForm {...profileScreen} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
});
