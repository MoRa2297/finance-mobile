import { useState, useCallback, useMemo } from 'react';
import { Dayjs } from 'dayjs';
import { SheetManager } from 'react-native-actions-sheet';
import { router } from 'expo-router';

import {
  useAuthStore,
  useUIStore,
  useTransactions,
  useDeleteTransaction,
  useDeleteTransfer,
} from '@/stores';
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

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

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
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const { mutateAsync: deleteTransfer } = useDeleteTransfer();

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

  const handleDeleteTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        if (transaction.type === 'TRANSFER' && transaction.transferDetailId) {
          await deleteTransfer(transaction.transferDetailId);
        } else {
          await deleteTransaction(transaction.id);
        }
      } catch (e) {
        console.error('Delete failed', e);
      } finally {
        setSelectedTransaction(undefined);
        setIsAlertVisible(false);
      }
    },
    [deleteTransaction, deleteTransfer],
  );

  const handleSelectRemoveTransaction = useCallback(
    (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setIsAlertVisible(true);
    },
    [],
  );

  const handleSelectTransaction = useCallback(
    (transaction: Transaction) => {
      SheetManager.show('transaction-detail-sheet', {
        payload: {
          transaction,
          onDelete: (tx: Transaction) => {
            SheetManager.hide('transaction-detail-sheet');
            handleSelectRemoveTransaction(tx);
          },
          onEdit: (tx: Transaction) => {
            SheetManager.hide('transaction-detail-sheet');
            router.push({
              pathname: '/transaction',
              params: { id: tx.id, mode: 'edit', formType: tx.type },
            });
          },
        },
      });
    },
    [handleSelectRemoveTransaction],
  );

  const handleAddTransaction = useCallback(() => {
    const formType =
      selectedTab !== TransactionFormTypes.ALL
        ? selectedTab
        : TransactionFormTypes.EXPENSE;

    router.push({
      pathname: '/transaction',
      params: { mode: 'create', formType },
    });
  }, [selectedTab]);

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
    handleSelectRemoveTransaction,
    isAlertVisible,
    setIsAlertVisible,
    handleDeleteTransaction,
    selectedTransaction,
    handleAddTransaction,
  };
};
