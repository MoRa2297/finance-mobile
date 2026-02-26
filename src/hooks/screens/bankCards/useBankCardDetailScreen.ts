import { useState, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs, { Dayjs } from 'dayjs';

import {
  useCardStore,
  cardSelectors,
  useBankAccountStore,
  bankAccountSelectors,
} from '@/stores';
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

  const cards = useCardStore(cardSelectors.cards);
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

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

  const bankCard = useMemo(
    () => cards.find(c => c.id === Number(id)) ?? null,
    [cards, id],
  );

  const cardType = useMemo(() => bankCard?.cardType ?? null, [bankCard]);

  const dateRange = useMemo(() => {
    if (!selectedDate) return { start: '', end: '' };
    return {
      start: selectedDate.startOf('month').format('DD-MM-YYYY'),
      end: selectedDate.endOf('month').format('DD-MM-YYYY'),
    };
  }, [selectedDate]);

  // TODO: reimplementare con transaction store
  const sections: TransactionSection[] = [];
  const totalSpent = 0;
  const categories: any[] = [];
  const bankCards = cards;

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
        if (selectedIndex === 0 && bankCard) {
          router.push({
            pathname: '/(auth)/bank-cards/bank-card-form',
            params: { id: bankCard.id },
          });
        }
      },
    );
  }, [showActionSheetWithOptions, actionSheetStyles, router, bankCard, t]);

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
    bankCard,
    cardType,
    dateRange,
    sections,
    totalSpent,
    categories,
    bankAccounts,
    bankCards,
    handleSelectMonth,
    handleSettingsPress,
    handleTransactionPress,
  };
};
