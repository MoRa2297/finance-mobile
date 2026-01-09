import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { StyleSheet } from 'react-native';
import { theme } from '@config/theme';

export const LoginHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout style={styles.container}>
      <Text category="h1">{t('screens.loginScreen.welcome')}</Text>
      <Text category="c2" appearance="hint">
        {t('screens.loginScreen.welcomeSub')}
      </Text>
    </Layout>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    gap: 10,
  },
});
