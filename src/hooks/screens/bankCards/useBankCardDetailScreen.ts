import { useState, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';

import { useCard } from '@/stores/card/card.queries';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { useActionSheetStyles } from '@/hooks';
import { Transaction, TransactionFilters } from '@/types';
import { MonthItem } from '@components/screens/home';
import { groupByDate } from '@components/screens/expenses/ExpensesList/ExpensesList.helpers';

export const useBankCardDetailScreen = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  const { data: bankCard, isLoading } = useCard(id ? Number(id) : null);

  // Month filtered — used for sections list and totalSpent
  const monthFilters: TransactionFilters = useMemo(
    () => ({
      cardAccountId: id ? Number(id) : undefined,
      ...(selectedDate && {
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      }),
    }),
    [id, selectedDate],
  );

  const { data: transactionData } = useTransactions(monthFilters);
  const transactions = transactionData?.transactions ?? [];

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const cardType = bankCard?.cardType ?? null;

  const dateRange = useMemo(() => {
    if (!selectedDate) return { start: '', end: '' };
    return {
      start: dayjs(selectedDate).startOf('month').format('DD-MM-YYYY'),
      end: dayjs(selectedDate).endOf('month').format('DD-MM-YYYY'),
    };
  }, [selectedDate]);

  // Total spent in selected month (or all time if no month selected)
  const totalSpent = useMemo(
    () =>
      transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const sections = useMemo(() => groupByDate(transactions), [transactions]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleSettingsPress = useCallback(() => {
    const options = [t('common:edit'), t('common:cancel')];
    showActionSheetWithOptions(
      { options, cancelButtonIndex: 1, ...actionSheetStyles },
      selectedIndex => {
        if (selectedIndex === 0 && bankCard) {
          router.push({
            pathname: '/(auth)/bank-cards/bank-card-form',
            params: { id: bankCard.id },
          });
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, router, bankCard]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push({
        pathname: '/(auth)/transaction',
        params: { id: transaction.id, formType: transaction.type },
      });
    },
    [router],
  );

  return {
    bankCard,
    cardType,
    dateRange,
    sections,
    totalSpent,
    isLoading,
    isNotFound: !isLoading && !bankCard,
    handleSelectMonth,
    handleSettingsPress,
    handleTransactionPress,
  };
};
