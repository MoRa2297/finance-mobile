import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs, { Dayjs } from 'dayjs';

import { useCardStore, cardSelectors } from '@/stores';
import { BankCard } from '@/types';
import { theme } from '@config/theme';

export const useBankCardsScreen = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store
  const bankCards = useCardStore(cardSelectors.cards);
  const isLoading = useCardStore(cardSelectors.isLoading);
  const fetchCards = useCardStore(state => state.fetchCards);
  const deleteCard = useCardStore(state => state.deleteCard);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  // Fetch on mount
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const totLimit = useMemo(
    () => bankCards.reduce((sum, card) => sum + card.cardLimit, 0),
    [bankCards],
  );

  // TODO: calcolare con transazioni reali
  const totSpent = 0;

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

  const handleSelectMonth = useCallback((month: any) => {
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

  const handleDeleteConfirm = useCallback(async () => {
    if (cardToDelete) {
      await deleteCard(cardToDelete.id);
      setCardToDelete(null);
      setAlertVisible(false);
    }
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
    handleSelectMonth,
    handleCardPress,
    handleOptionsPress,
    handleAddCard,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
