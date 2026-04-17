import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { theme } from '@config/theme';

export const RegisterHeader: FC = () => {
  const { t } = useTranslation(['registerPage']);

  return (
    <Layout style={styles.container}>
      <Text category="h1">{t('registerPage:welcome')}</Text>
      <Text category="c2" appearance="hint">
        {t('registerPage:welcomeSub')}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    gap: 10,
  },
});
