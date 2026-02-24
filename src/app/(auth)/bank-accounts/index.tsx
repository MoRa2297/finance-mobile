import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BankAccountListCard } from '@/components/screens/settings/bankAccounts';
import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Alert } from '@components/ui/Alert';
import { EmptyData, LoadingSpinner } from '@components/common';
import { SpecificPrice } from '@components/screens/home';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { useBankAccountsScreen } from '@/hooks/screens/bankAccounts';

export default function BankAccountsScreen() {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const {
    bankAccounts,
    isLoading,
    totSpent,
    totResidue,
    alertVisible,
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
        onPress={handleAccountPress}
        onOptionsPress={handleOptionsPress}
      />
    ),
    [handleAccountPress, handleOptionsPress],
  );

  const renderEmpty = useCallback(
    () => <EmptyData title={t('bankAccountPage:emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback(
    (item: BankAccount) => item.id.toString(),
    [],
  );

  if (isLoading) {
    return (
      <ScreenContainer style={styles.container}>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
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

      <View style={[styles.listContainer, { paddingBottom: bottomTabHeight }]}>
        <FlatList
          data={bankAccounts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            bankAccounts.length === 0 && styles.listContentEmpty,
          ]}
        />
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  listContent: {
    paddingTop: 25,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 15,
  },
  listContentEmpty: {
    flex: 1,
  },
});
