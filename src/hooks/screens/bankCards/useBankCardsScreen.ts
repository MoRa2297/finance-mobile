import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';

import { useCards } from '@/stores/card/card.queries';
import { useDeleteCard } from '@/stores/card/card.mutations';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { useActionSheetStyles } from '@/hooks';
import { useUIStore } from '@/stores';
import { BankCard, TransactionFilters } from '@/types';
import { MonthItem } from '@components/screens/home';

export const useBankCardsScreen = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  const { data: bankCards = [], isLoading } = useCards();
  const { mutateAsync: deleteCard } = useDeleteCard();

  const transactionFilters: TransactionFilters = useMemo(
    () => ({
      ...(selectedDate && {
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      }),
    }),
    [selectedDate],
  );

  const { data: transactionData } = useTransactions(transactionFilters);
  const transactions = transactionData?.transactions ?? [];

  const totLimit = useMemo(
    () => bankCards.reduce((sum, card) => sum + card.cardLimit, 0),
    [bankCards],
  );

  const totSpent = useMemo(
    () =>
      transactions
        .filter(t => t.type === 'EXPENSE' && t.cardAccountId !== null)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const keyExtractor = useCallback((item: BankCard) => item.id.toString(), []);

  const listContentStyle = useMemo(
    () => ({ paddingBottom: bottomTabHeight * 2 }),
    [bottomTabHeight],
  );

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
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
    showActionSheetWithOptions(
      {
        options: [t('bankCardsPage:actionSheetCreateCard'), t('common:cancel')],
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0)
          router.push('/(auth)/bank-cards/bank-card-form');
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, router]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!cardToDelete) return;
    await deleteCard(cardToDelete.id);
    setCardToDelete(null);
    setAlertVisible(false);
  }, [cardToDelete, deleteCard]);

  const handleDeleteCancel = useCallback(() => {
    setCardToDelete(null);
    setAlertVisible(false);
  }, []);

  return {
    bankCards,
    isLoading,
    totLimit,
    totSpent,
    alertVisible,
    keyExtractor,
    listContentStyle,
    handleSelectMonth,
    handleCardPress,
    handleOptionsPress,
    handleAddCard,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
