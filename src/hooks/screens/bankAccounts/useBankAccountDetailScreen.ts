import { useState, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';

import { useBankAccount } from '@/stores/bank-account/bank-account.queries';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { useActionSheetStyles } from '@/hooks';
import { TransactionFilters } from '@/types';
import { MonthItem } from '@components/screens/home';
import { groupByDate } from '@components/screens/expenses/ExpensesList/ExpensesList.helpers';

export const useBankAccountDetailScreen = () => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  const { data: bankAccount, isLoading } = useBankAccount(
    id ? Number(id) : null,
  );

  // All transactions for this account ever — used for balance calculation
  const allAccountFilters: TransactionFilters = useMemo(
    () => ({ bankAccountId: id ? Number(id) : undefined }),
    [id],
  );

  const { data: allTransactionData } = useTransactions(allAccountFilters);
  const allTransactions = allTransactionData?.transactions ?? [];

  // Filtered by month — used for sections list and stats
  const monthFilters: TransactionFilters = useMemo(
    () => ({
      bankAccountId: id ? Number(id) : undefined,
      ...(selectedDate && {
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      }),
    }),
    [id, selectedDate],
  );

  const { data: monthTransactionData } = useTransactions(monthFilters);
  const monthTransactions = monthTransactionData?.transactions ?? [];

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const bankType = bankAccount?.bankType ?? null;
  const bankAccountType = bankAccount?.bankAccountType ?? null;

  // Real balance up to end of selected month (or all time if no month selected)
  const currentBalance = useMemo(() => {
    const relevantTransactions = selectedDate
      ? allTransactions.filter(t =>
          dayjs(t.date).isBefore(selectedDate.endOf('month').add(1, 'day')),
        )
      : allTransactions;

    const income = relevantTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = relevantTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return (bankAccount?.startingBalance ?? 0) + income - expense;
  }, [bankAccount, allTransactions, selectedDate]);

  // Stats based on selected month transactions
  const stats = useMemo(() => {
    const countSpent = monthTransactions.filter(
      t => t.type === 'EXPENSE',
    ).length;
    const countIncome = monthTransactions.filter(
      t => t.type === 'INCOME',
    ).length;
    const totalTransfers = monthTransactions.filter(
      t => t.type === 'TRANSFER',
    ).length;

    return {
      countSpent: String(countSpent),
      countIncome: String(countIncome),
      totalTransfers: String(totalTransfers),
    };
  }, [monthTransactions]);

  const sections = useMemo(
    () => groupByDate(monthTransactions),
    [monthTransactions],
  );

  const formattedValues = useMemo(
    () => ({
      currentBalance: `€ ${currentBalance.toFixed(2)}`,
      startingBalance: `€ ${(bankAccount?.startingBalance ?? 0).toFixed(2)}`,
      accountTypeName: bankAccountType
        ? t(`bankAccountPage:types.${bankAccountType.name}`)
        : '-',
    }),
    [currentBalance, bankAccount, bankAccountType, t],
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleSettingsPress = useCallback(() => {
    const options = [t('common:edit'), t('common:cancel')];
    showActionSheetWithOptions(
      { options, cancelButtonIndex: 1, ...actionSheetStyles },
      selectedIndex => {
        if (selectedIndex === 0 && bankAccount) {
          router.push({
            pathname: '/(auth)/bank-accounts/bank-account-form',
            params: { id: bankAccount.id },
          });
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, router, bankAccount]);

  return {
    bankAccount,
    bankType,
    stats,
    sections,
    formattedValues,
    isLoading,
    isNotFound: !isLoading && !bankAccount,
    handleSelectMonth,
    handleSettingsPress,
  };
};
