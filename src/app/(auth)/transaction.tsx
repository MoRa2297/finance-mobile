import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { Header } from '@components/ui/Header';
import { Button } from '@components/ui/Button';
import { Icon } from '@components/ui/Icon';
import { useTransactionFormScreen } from '@/hooks/screens/transaction';
import { TransactionForm } from '@components/screens/transaction';

export default function TransactionFormScreen() {
  const { t } = useTranslation(['transactionPage', 'common']);

  const {
    existingTransaction,
    formType,
    formTypeLabel,
    submitError,
    isSubmitting,
    handleOpenTypeSelector,
    handleSubmit,
    handleCancel,
  } = useTransactionFormScreen();

  const renderTypeSelector = () => (
    <Button
      buttonText={formTypeLabel}
      onPress={handleOpenTypeSelector}
      backgroundColor={theme.colors.primary}
      style={styles.typeSelectorButton}
      textStyle={styles.typeSelectorText}
      accessoryRight={() => (
        <Icon
          name="arrow-ios-downward-outline"
          color={theme.colors.basic100}
          size={20}
        />
      )}
    />
  );

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{
          type: 'back',
          variant: 'text',
          text: t('common:cancel'),
          onPress: handleCancel,
        }}
        center={{ type: 'custom', render: renderTypeSelector }}
      />

      <TransactionForm
        formType={formType}
        transaction={existingTransaction}
        onSubmit={handleSubmit}
        submitError={submitError}
        isSubmitting={isSubmitting}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  typeSelectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 60,
  },
  typeSelectorText: {
    color: theme.colors.basic100,
  },
});
