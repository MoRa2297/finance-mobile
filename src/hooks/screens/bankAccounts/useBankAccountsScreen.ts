import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';

import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import { useDeleteBankAccount } from '@/stores/bank-account/bank-account.mutations';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { useActionSheetStyles } from '@/hooks';
import { useUIStore } from '@/stores';
import { BankAccount, TransactionFilters } from '@/types';
import { MonthItem } from '@components/screens/home';

export const useBankAccountsScreen = () => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null,
  );

  const { data: bankAccounts = [], isLoading } = useBankAccounts();
  const { mutateAsync: deleteBankAccount } = useDeleteBankAccount();

  const { data: allTransactionData } = useTransactions({});
  const allTransactions = allTransactionData?.transactions ?? [];

  const monthFilters: TransactionFilters = useMemo(
    () => ({
      ...(selectedDate && {
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      }),
    }),
    [selectedDate],
  );

  const { data: monthTransactionData } = useTransactions(monthFilters);
  const monthTransactions = monthTransactionData?.transactions ?? [];

  const totResidue = useMemo(() => {
    const startingBalances = bankAccounts.reduce(
      (sum, a) => sum + a.startingBalance,
      0,
    );
    const relevantTransactions = selectedDate
      ? allTransactions.filter(t =>
          dayjs(t.date).isBefore(selectedDate.endOf('month').add(1, 'day')),
        )
      : allTransactions;

    const totalIncome = relevantTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = relevantTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return startingBalances + totalIncome - totalExpense;
  }, [bankAccounts, allTransactions, selectedDate]);

  const totSpent = useMemo(
    () =>
      monthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions],
  );

  const keyExtractor = useCallback(
    (item: BankAccount) => item.id.toString(),
    [],
  );

  const listContentStyle = useMemo(
    () => ({ paddingBottom: bottomTabHeight }),
    [bottomTabHeight],
  );

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
      showActionSheetWithOptions(
        {
          options: [t('common:edit'), t('common:delete'), t('common:cancel')],
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
    [t, showActionSheetWithOptions, router, actionSheetStyles],
  );

  const handleAddAccount = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: [
          t('bankAccountPage:bankAccountActionSheet.createBankAccount'),
          t('common:cancel'),
        ],
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push('/(auth)/bank-accounts/bank-account-form');
        }
      },
    );
  }, [t, showActionSheetWithOptions, router, actionSheetStyles]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!accountToDelete) return;
    await deleteBankAccount(accountToDelete.id);
    setAccountToDelete(null);
    setAlertVisible(false);
  }, [accountToDelete, deleteBankAccount]);

  const handleDeleteCancel = useCallback(() => {
    setAccountToDelete(null);
    setAlertVisible(false);
  }, []);

  return {
    bankAccounts,
    allTransactions,
    isLoading,
    totSpent,
    totResidue,
    alertVisible,
    keyExtractor,
    listContentStyle,
    handleSelectMonth,
    handleAccountPress,
    handleOptionsPress,
    handleAddAccount,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
