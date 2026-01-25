import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';

import { useDataStore } from '@/stores';
import {
  selectTransactions,
  selectBankAccounts,
  selectIsLoading,
  filterTransactionsByMonth,
  calculateTotals,
  calculateResidue,
} from '@/stores/data/data.selectors';
import { BankAccount, SwipePickerMonth } from '@/types';
import { MonthItem } from '@components/screens/home';
import { theme } from '@config/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useBankAccountsScreen = () => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store data - using selectors
  const transactions = useDataStore(selectTransactions);
  const bankAccounts = useDataStore(selectBankAccounts);
  const isLoading = useDataStore(selectIsLoading);
  const deleteBankAccount = useDataStore(state => state.deleteBankAccount);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null,
  );

  // Derived data
  const filteredTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, selectedDate),
    [transactions, selectedDate],
  );

  const { expense: totSpent } = useMemo(
    () => calculateTotals(filteredTransactions),
    [filteredTransactions],
  );

  const totResidue = useMemo(
    () => calculateResidue(filteredTransactions, bankAccounts),
    [filteredTransactions, bankAccounts],
  );

  // Action sheet styles
  const actionSheetStyles = useMemo(
    () => ({
      containerStyle: {
        borderRadius: 20,
        backgroundColor: theme.colors.secondaryBK,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.colors.primaryBK,
        marginBottom: insets.bottom,
      },
      textStyle: {
        textAlign: 'center' as const,
        color: theme.colors.basic100,
      },
    }),
    [insets.bottom],
  );

  // Handlers

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleAccountPress = useCallback(
    (account: BankAccount) => {
      router.push({
        pathname: '/(auth)/bank-accounts/bank-account-detail',
        params: { id: account.id },
      });
    },
    [router],
  );

  const handleOptionsPress = useCallback(
    (account: BankAccount) => {
      const options = [
        t('common:edit'),
        t('common:delete'),
        t('common:cancel'),
      ];

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          ...actionSheetStyles,
        },
        selectedIndex => {
          if (selectedIndex === 0) {
            router.push({
              pathname: '/(auth)/bank-accounts/bank-account-form',
              params: { id: account.id },
            });
          } else if (selectedIndex === 1) {
            setAccountToDelete(account);
            setAlertVisible(true);
          }
        },
      );
    },
    [t, showActionSheetWithOptions, router],
  );

  const handleAddAccount = useCallback(() => {
    const options = [
      t('bankAccountPage:bankAccountActionSheet.createBankAccount'),
      t('common:cancel'),
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          // TODO use conf var
          router.push('/(auth)/bank-accounts/bank-account-form');
        }
      },
    );
  }, [t, showActionSheetWithOptions, router]);

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

  return {
    // Data
    bankAccounts,
    isLoading,
    totSpent,
    totResidue,

    // Alert state
    alertVisible,

    // Handlers
    handleSelectMonth,
    handleAccountPress,
    handleOptionsPress,
    handleAddAccount,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
