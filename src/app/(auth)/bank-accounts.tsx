import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { BankAccountListCard } from '@/components/screens/settings/bankAccounts';
import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount, SwipePickerMonth } from '@/types';
import { getMonths } from '@/utils/date';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Alert } from '@components/ui/Alert';
import { EmptyData, LoadingSpinner } from '@components/common';
import { SpecificPrice } from '@components/screens/home';

dayjs.extend(isBetween);

export default function BankAccountsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Stores
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const transactions = useDataStore(state => state.transactions);
  const deleteBankAccount = useDataStore(state => state.deleteBankAccount);
  const isLoading = useDataStore(state => state.isLoading);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // State
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<SwipePickerMonth | null>(
    null,
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null,
  );

  const MONTHS = useMemo(() => getMonths(), []);

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    if (!selectedDate) return transactions;

    return transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.date);
      const startDate = dayjs(selectedDate.date).startOf('month');
      const endDate = dayjs(selectedDate.date).endOf('month');
      return transactionDate.isBetween(startDate, endDate, null, '[]');
    });
  }, [transactions, selectedDate]);

  // Calculate totals
  const totSpent = useMemo(() => {
    return filteredTransactions
      .filter(
        t => (t.type === 'expense' || t.type === 'card_spending') && t.recived,
      )
      .reduce((sum, t) => sum + parseFloat(t.money), 0);
  }, [filteredTransactions]);

  const totResidue = useMemo(() => {
    const totIncome = filteredTransactions
      .filter(t => t.type === 'income' && t.recived)
      .reduce((sum, t) => sum + parseFloat(t.money), 0);

    const totSpentCalc = filteredTransactions
      .filter(
        t => (t.type === 'expense' || t.type === 'card_spending') && t.recived,
      )
      .reduce((sum, t) => sum + parseFloat(t.money), 0);

    const totStartingBalance = bankAccounts.reduce(
      (sum, account) => sum + account.startingBalance,
      0,
    );

    return totStartingBalance + totIncome - totSpentCalc;
  }, [filteredTransactions, bankAccounts]);

  // Handlers
  const handleGetSelectedMonth = useCallback(
    (selected: SwipePickerMonth, index: number) => {
      setCurrentSelectIndex(index);
      setSelectedDate(selected);
    },
    [],
  );

  const handleAccountPress = useCallback(
    (account: BankAccount) => {
      router.push({
        pathname: '/(auth)/bank-account-detail',
        params: { id: account.id },
      });
    },
    [router],
  );

  const handleOptionsPress = useCallback(
    (account: BankAccount) => {
      const options = [
        t('screens.bankAccountScreen.edit'),
        t('screens.bankAccountScreen.delete'),
        t('common.cancel'),
      ];
      const destructiveButtonIndex = 1;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          // containerStyle: [
          //   styles.actionSheetContainer,
          //   { marginBottom: insets.bottom },
          // ],
          textStyle: styles.actionSheetText,
        },
        selectedIndex => {
          switch (selectedIndex) {
            case 0:
              router.push({
                pathname: '/(auth)/bank-account-form',
                params: { id: account.id },
              });
              break;
            case 1:
              setAccountToDelete(account);
              setAlertVisible(true);
              break;
          }
        },
      );
    },
    [t, insets.bottom, showActionSheetWithOptions, router],
  );

  const handleAddAccount = useCallback(() => {
    const options = [
      t('screens.bankAccountScreen.createBankAccount'),
      t('common.cancel'),
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // containerStyle: [
        //   styles.actionSheetContainer,
        //   { marginBottom: insets.bottom },
        // ],
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          // router.push('/(auth)/bank-account-form');
        }
      },
    );
  }, [t, insets.bottom, showActionSheetWithOptions, router]);

  const handleDeleteConfirm = useCallback(() => {
    if (accountToDelete) {
      deleteBankAccount(accountToDelete.id);
      setAccountToDelete(null);
      setAlertVisible(false);
    }
  }, [accountToDelete, deleteBankAccount]);

  const handleDeleteCancel = useCallback(() => {
    setAccountToDelete(null);
    setAlertVisible(false);
  }, []);

  // Render
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
    () => <EmptyData title={t('screens.bankAccountScreen.emptyData')} />,
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
      {/* Top Section */}
      <TopRoundedContainer height="30%" paddingTop={0}>
        {/*<Header*/}
        {/*  title={t('screens.bankAccountScreen.headerTitle')}*/}
        {/*  showBackButton*/}
        {/*  onSettingsPress={handleAddAccount}*/}
        {/*/>*/}

        <View style={styles.subContainer}>
          {/* Month Picker */}
          <View style={styles.pickerContainer}>
            {/*<SwipePicker*/}
            {/*  currentSelectIndex={currentSelectIndex}*/}
            {/*  data={MONTHS}*/}
            {/*  showButtons*/}
            {/*  onSelect={handleGetSelectedMonth}*/}
            {/*  containerWidth={100}*/}
            {/*/>*/}
          </View>

          {/* Amounts */}
          <View style={styles.amountContainer}>
            <SpecificPrice
              title={t('screens.bankAccountScreen.residue')}
              amount={`€ ${totResidue.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-down-outline"
              iconColor={theme.colors.basic100}
            />
            <SpecificPrice
              title={t('screens.bankAccountScreen.spent')}
              amount={`€ ${totSpent.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-up-outline"
              iconColor={theme.colors.basic100}
            />
          </View>
        </View>
      </TopRoundedContainer>

      {/* List */}
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

      {/* Delete Alert */}
      <Alert
        visible={alertVisible}
        title={t('screens.bankAccountScreen.alertTitle')}
        subtitle={t('screens.bankAccountScreen.alertSubTitle')}
        primaryButtonText={t('common.delete')}
        secondaryButtonText={t('common.cancel')}
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
    backgroundColor: theme.colors.transparent,
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
  actionSheetContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  actionSheetText: {
    textAlign: 'center',
    color: theme.colors.basic100,
  },
});
