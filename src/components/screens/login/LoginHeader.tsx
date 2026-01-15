import React, { FC } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { StyleSheet } from 'react-native';
import { theme } from '@config/theme';

export const LoginHeader: FC = () => {
  const { t } = useTranslation(['loginPage']);

  return (
    <Layout style={styles.container}>
      <Text category="h1">{t('loginPage:welcome')}</Text>
      <Text category="c2" appearance="hint">
        {t('loginPage:welcomeSub')}
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
