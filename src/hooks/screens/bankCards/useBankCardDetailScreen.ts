import { useState, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs, { Dayjs } from 'dayjs';

import { useDataStore } from '@/stores';
import { Transaction, SwipePickerMonth } from '@/types';
import { theme } from '@config/theme';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

export const useBankCardDetailScreen = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store data
  const bankCards = useDataStore(state => state.bankCards);
  const cardTypes = useDataStore(state => state.cardTypes);
  const transactions = useDataStore(state => state.transactions);
  const categories = useDataStore(state => state.categories);
  const bankAccounts = useDataStore(state => state.bankAccounts);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

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

  // Find bank card
  const bankCard = useMemo(() => {
    return bankCards.find(bc => bc.id === Number(id));
  }, [bankCards, id]);

  // Find card type
  const cardType = useMemo(() => {
    if (!bankCard) return null;
    return cardTypes.find(ct => ct.id === bankCard.cardTypeId);
  }, [bankCard, cardTypes]);

  // Calculate date range
  const dateRange = useMemo(() => {
    if (!selectedDate) return { start: '', end: '' };

    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');

    return {
      start: startOfMonth.format('DD-MM-YYYY'),
      end: endOfMonth.format('DD-MM-YYYY'),
    };
  }, [selectedDate]);

  // Filter and group transactions
  const { sections, totalSpent } = useMemo(() => {
    if (!bankCard) return { sections: [], totalSpent: 0 };

    let cardTransactions = transactions.filter(
      t => t.cardId === bankCard.id && t.type === 'card_spending',
    );

    // Filter by month if selected
    if (selectedDate) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();

      cardTransactions = cardTransactions.filter(transaction => {
        const transactionDate = dayjs(transaction.date);
        return (
          transactionDate.month() === selectedMonth &&
          transactionDate.year() === selectedYear
        );
      });
    }

    // Calculate total spent
    const total = cardTransactions
      .filter(t => t.recived)
      .reduce((sum, t) => sum + parseFloat(t.money), 0);

    // Group by date
    const grouped = cardTransactions.reduce<Record<string, Transaction[]>>(
      (acc, transaction) => {
        const dateKey = dayjs(transaction.date).format('DD-MM-YYYY');

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
      },
      {},
    );

    const sectionData: TransactionSection[] = Object.keys(grouped)
      .sort((a, b) => {
        const dateA = dayjs(a, 'DD-MM-YYYY');
        const dateB = dayjs(b, 'DD-MM-YYYY');
        return dateB.valueOf() - dateA.valueOf();
      })
      .map(date => ({
        title: date,
        data: grouped[date],
      }));

    return { sections: sectionData, totalSpent: total };
  }, [bankCard, transactions, selectedDate]);

  // Handlers
  const handleSelectMonth = useCallback((month: SwipePickerMonth) => {
    setSelectedDate(dayjs(month.date));
  }, []);

  const handleSettingsPress = useCallback(() => {
    const options = [t('common:edit'), t('common:cancel')];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push({
            pathname: '/(auth)/bank-cards/bank-card-form',
            params: { id: bankCard?.id },
          });
        }
      },
    );
  }, [showActionSheetWithOptions, actionSheetStyles, router, bankCard?.id, t]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push({
        pathname: '/(auth)/transaction',
        params: { id: transaction.id },
      });
    },
    [router],
  );

  return {
    // Data
    bankCard,
    cardType,
    dateRange,
    sections,
    totalSpent,
    categories,
    bankAccounts,
    bankCards,

    // Handlers
    handleSelectMonth,
    handleSettingsPress,
    handleTransactionPress,
  };
};
