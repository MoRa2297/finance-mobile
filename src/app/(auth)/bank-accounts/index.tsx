import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BankAccountListCard } from '@/components/screens/settings/bankAccounts';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Alert } from '@components/ui/Alert';
import { EmptyData, LoadingSpinner } from '@components/common';
import { SpecificPrice } from '@components/screens/home';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { useBankAccountsScreen } from '@hooks/screens/bankAccounts';

export default function BankAccountsScreen() {
  const { t } = useTranslation(['bankAccountPage', 'common']);

  const {
    allTransactions,
    bankAccounts,
    isLoading,
    totSpent,
    totResidue,
    alertVisible,
    keyExtractor,
    listContentStyle,
    handleSelectMonth,
    handleAccountPress,
    handleOptionsPress,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleAddAccount,
  } = useBankAccountsScreen();

  const renderItem = useCallback(
    ({ item }: { item: BankAccount }) => (
      <BankAccountListCard
        bankAccount={item}
        allTransactions={allTransactions}
        onPress={handleAccountPress}
        onOptionsPress={handleOptionsPress}
      />
    ),
    [handleAccountPress, handleOptionsPress, allTransactions],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <EmptyData
        variant="centered"
        iconName="credit-card-outline"
        title={t('bankAccountPage:empty.title')}
        subtitle={t('bankAccountPage:empty.subtitle')}
        action={{
          label: t('bankAccountPage:empty.cta'),
          onPress: handleAddAccount,
        }}
      />
    );
  }, [isLoading, t, handleAddAccount]);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding
      statusBarBackground={theme.colors.primaryBK}>
      <TopRoundedContainer height="30%" paddingTop={0}>
        <Header
          left={{ type: 'back', variant: 'icon' }}
          right={{ type: 'settings', onPress: handleAddAccount }}
        />

        <View style={styles.subContainer}>
          <View style={styles.pickerContainer}>
            <MonthSwipePicker
              onSelectMonth={handleSelectMonth}
              containerWidth={150}
              showArrows
            />
          </View>

          <View style={styles.amountContainer}>
            <SpecificPrice
              title={t('bankAccountPage:residue')}
              amount={`€ ${totResidue.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-down-outline"
              iconColor={theme.colors.basic100}
            />
            <SpecificPrice
              title={t('bankAccountPage:spent')}
              amount={`€ ${totSpent.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-up-outline"
              iconColor={theme.colors.basic100}
            />
          </View>
        </View>
      </TopRoundedContainer>

      <View style={styles.listContainer}>
        {isLoading ? (
          <LoadingSpinner
            color={theme.colors.primary}
            backgroundColor={theme.colors.secondaryBK}
          />
        ) : (
          <FlatList
            data={bankAccounts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              bankAccounts.length === 0 && styles.listContentEmpty,
              listContentStyle,
            ]}
          />
        )}
      </View>

      <Alert
        visible={alertVisible}
        title={t('bankAccountPage:alertTitle')}
        subtitle={t('bankAccountPage:alertSubTitle')}
        primaryButtonText={t('common:delete')}
        secondaryButtonText={t('common:cancel')}
        onPrimaryPress={handleDeleteConfirm}
        onSecondaryPress={handleDeleteCancel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.secondaryBK },
  subContainer: { flex: 1, justifyContent: 'space-evenly' },
  pickerContainer: { alignItems: 'center', width: '100%' },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
    marginTop: -GLOBAL_BORDER_RADIUS,
  },
  listContent: {
    paddingTop: GLOBAL_BORDER_RADIUS + 15,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 15,
    paddingBottom: 30,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
});
