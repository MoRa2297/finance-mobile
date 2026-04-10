import { useState, useCallback, useMemo } from 'react';
import { Dayjs } from 'dayjs';
import { SheetManager } from 'react-native-actions-sheet';
import { router } from 'expo-router';

import { useAuthStore, useUIStore } from '@/stores';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { Tab } from '@components/ui/SliderBar';
import { MonthItem } from '@components/screens/home';
import { Transaction, TransactionFilters, TransactionFormTypes } from '@/types';

const TABS: Tab[] = [
  { title: 'expensesPage:tabs.all', value: TransactionFormTypes.ALL },
  { title: 'expensesPage:tabs.expenses', value: TransactionFormTypes.EXPENSE },
  { title: 'expensesPage:tabs.income', value: TransactionFormTypes.INCOME },
];

export const useExpensesScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTab, setSelectedTab] = useState<TransactionFormTypes>(
    TABS[0].value as TransactionFormTypes,
  );

  const user = useAuthStore(state => state.user);
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  const filters: TransactionFilters = useMemo(
    () => ({
      ...(selectedDate && {
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      }),
      ...(selectedTab !== TransactionFormTypes.ALL && { type: selectedTab }),
    }),
    [selectedDate, selectedTab],
  );

  const { data, isLoading, isError } = useTransactions(filters);
  const transactions = data?.transactions ?? [];

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionFormTypes.INCOME) acc.income += t.amount;
        else if (t.type === TransactionFormTypes.EXPENSE)
          acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const formatAmount = useCallback(
    (amount: number) => (moneyIsVisible ? `${amount.toFixed(2)} €` : '--'),
    [moneyIsVisible],
  );

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value as TransactionFormTypes);
  }, []);

  const handleToggleMoneyVisibility = useCallback(() => {
    setMoneyIsVisible();
  }, [setMoneyIsVisible]);

  const handleSelectTransaction = useCallback((transaction: Transaction) => {
    SheetManager.show('transaction-detail-sheet', {
      payload: {
        transaction,
        onEdit: (tx: Transaction) => {
          SheetManager.hide('transaction-detail-sheet');
          router.push({
            pathname: '/transaction',
            params: { id: tx.id, mode: 'edit' },
          });
        },
      },
    });
  }, []);

  return {
    tabs: TABS,
    handleSelectMonth,
    handleTabChange,
    user,
    filteredTransactions: transactions,
    totals,
    isLoading,
    isError,
    formatAmount,
    moneyIsVisible,
    handleToggleMoneyVisibility,
    handleSelectTransaction,
  };
};
