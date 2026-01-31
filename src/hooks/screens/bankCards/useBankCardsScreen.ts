import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs, { Dayjs } from 'dayjs';

import { useDataStore } from '@/stores';
import { BankCard, SwipePickerMonth } from '@/types';
import { theme } from '@config/theme';

export const useBankCardsScreen = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store data
  const bankCards = useDataStore(state => state.bankCards);
  const transactions = useDataStore(state => state.transactions);
  const deleteBankCard = useDataStore(state => state.deleteBankCard);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  // Calculate total limit
  const totLimit = useMemo(() => {
    return bankCards.reduce((sum, card) => sum + parseFloat(card.cardLimit), 0);
  }, [bankCards]);

  // Calculate total spent (filtered by month if selected)
  const totSpent = useMemo(() => {
    let filteredTransactions = transactions;

    if (selectedDate) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();

      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = dayjs(transaction.date);
        return (
          transactionDate.month() === selectedMonth &&
          transactionDate.year() === selectedYear
        );
      });
    }

    return filteredTransactions
      .filter(t => t.type === 'card_spending' && t.recived)
      .reduce((sum, t) => sum + parseFloat(t.money), 0);
  }, [transactions, selectedDate]);

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

  const handleSelectMonth = useCallback((month: SwipePickerMonth) => {
    setSelectedDate(dayjs(month.date));
  }, []);

  const handleCardPress = useCallback(
    (card: BankCard) => {
      router.push({
        pathname: '/(auth)/bank-cards/bank-card-detail',
        params: { id: card.id },
      });
    },
    [router],
  );

  const handleOptionsPress = useCallback(
    (card: BankCard) => {
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
              pathname: '/(auth)/bank-cards/bank-card-form',
              params: { id: card.id },
            });
          } else if (selectedIndex === 1) {
            setCardToDelete(card);
            setAlertVisible(true);
          }
        },
      );
    },
    [t, showActionSheetWithOptions, actionSheetStyles, router],
  );

  const handleAddCard = useCallback(() => {
    const options = [
      t('bankCardsPage:actionSheetCreateCard'),
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
          router.push('/(auth)/bank-cards/bank-card-form');
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, router]);

  const handleDeleteConfirm = useCallback(() => {
    if (cardToDelete) {
      deleteBankCard(cardToDelete.id);
      setCardToDelete(null);
      setAlertVisible(false);
    }
  }, [cardToDelete, deleteBankCard]);

  const handleDeleteCancel = useCallback(() => {
    setCardToDelete(null);
    setAlertVisible(false);
  }, []);

  return {
    // Data
    bankCards,
    totLimit,
    totSpent,

    // Alert state
    alertVisible,

    // Handlers
    handleSelectMonth,
    handleCardPress,
    handleOptionsPress,
    handleAddCard,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
