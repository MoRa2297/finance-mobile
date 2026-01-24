import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, SectionList, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExpenseCard } from '@/components/screens/expenses';
import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Transaction, SwipePickerMonth } from '@/types';
import { getMonths } from '@/utils/date';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { EmptyData } from '@components/common';
import { GenericSmallDetail } from '@components/ui/GenericSmallDetail';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

export default function BankCardDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Stores
  const bankCards = useDataStore(state => state.bankCards);
  const cardTypes = useDataStore(state => state.cardTypes);
  const transactions = useDataStore(state => state.transactions);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // State
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<SwipePickerMonth | null>(
    null,
  );

  const MONTHS = useMemo(() => getMonths(), []);

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

    const date = new Date(selectedDate.date);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const formatDate = (d: Date) =>
      `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getFullYear()}`;

    return {
      start: formatDate(startOfMonth),
      end: formatDate(endOfMonth),
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
      const selectedMonth = selectedDate.date.getMonth();
      const selectedYear = selectedDate.date.getFullYear();

      cardTransactions = cardTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
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
        const date = new Date(transaction.date);
        const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${date.getFullYear()}`;

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
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      })
      .map(date => ({
        title: date,
        data: grouped[date],
      }));

    return { sections: sectionData, totalSpent: total };
  }, [bankCard, transactions, selectedDate]);

  // Handlers
  const handleGetSelectedMonth = useCallback(
    (selected: SwipePickerMonth, index: number) => {
      setCurrentSelectIndex(index);
      setSelectedDate(selected);
    },
    [],
  );

  const handleSettingsPress = useCallback(() => {
    const options = [
      t('screens.bankCardListScreen.actionSheetEditCard'),
      t('common.cancel'),
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // containerStyle: [
        //   styles.actionSheetContainer,
        //   { marginBottom: insets.bottom },
        // ],
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push({
            pathname: '/(auth)/bank-card-form',
            params: { id: bankCard?.id },
          });
        }
      },
    );
  }, [t, insets.bottom, showActionSheetWithOptions, router, bankCard?.id]);

  if (!bankCard) {
    return (
      <ScreenContainer style={styles.container}>
        {/*<Header title={t('common.error')} showBackButton />*/}
        <View style={styles.errorContainer}>
          <Text category="s1" style={styles.errorText}>
            {t('screens.bankCardDetailScreen.notFound')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const categories = useDataStore(state => state.categories);
  const bankAccounts = useDataStore(state => state.bankAccounts);

  // Poi aggiorna renderItem
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard
        transaction={item}
        categories={categories}
        bankAccounts={bankAccounts}
        bankCards={bankCards}
        onPress={() => {}}
      />
    ),
    [categories, bankAccounts, bankCards],
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: TransactionSection;
  }) => (
    <Text category="p1" style={styles.sectionHeader}>
      {section.title}
    </Text>
  );

  const renderEmpty = () => (
    <EmptyData title={t('screens.expensesScreen.emptyData')} />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header */}
      {/*<Header*/}
      {/*  title={bankCard.name}*/}
      {/*  showBackButton*/}
      {/*  onSettingsPress={handleSettingsPress}*/}
      {/*/>*/}

      {/* Month Picker */}
      <View style={styles.pickerContainer}>
        {/*<SwipePicker*/}
        {/*  currentSelectIndex={currentSelectIndex}*/}
        {/*  arrSwipeData={MONTHS}*/}
        {/*  showSwipeBtn*/}
        {/*  onScreenChange={handleGetSelectedMonth}*/}
        {/*  containerWidth={130}*/}
        {/*/>*/}
      </View>

      {/* Content */}
      <View
        style={[styles.contentContainer, { marginBottom: bottomTabHeight }]}>
        {/* Card Type Image */}
        <View style={styles.cardImageContainer}>
          {cardType?.imageUrl && (
            <Image
              source={{ uri: cardType.imageUrl }}
              style={styles.cardImage}
            />
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          {/* Date Range */}
          <View style={styles.rowContainer}>
            <GenericSmallDetail
              title={t(
                'screens.bankCardDetailScreen.genericSmallDetailTitles.startPeriod',
              )}
              iconName="calendar-outline"
              value={dateRange.start}
            />
            <GenericSmallDetail
              title={t(
                'screens.bankCardDetailScreen.genericSmallDetailTitles.endPeriod',
              )}
              iconName="calendar-outline"
              value={dateRange.end}
            />
          </View>

          {/* Total Spent */}
          <View style={styles.singleRowContainer}>
            <GenericSmallDetail
              title={t(
                'screens.bankCardDetailScreen.genericSmallDetailTitles.totalSpent',
              )}
              iconName="activity-outline"
              value={`€ ${totalSpent.toFixed(2)}`}
            />
          </View>

          {/* Transactions List */}
          <SectionList
            sections={sections}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            style={styles.list}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
    gap: 15,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.textHint,
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.secondaryBK,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  cardImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: theme.colors.transparent,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  singleRowContainer: {
    flexDirection: 'row',
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 17,
    backgroundColor: theme.colors.primaryBK,
    paddingVertical: 10,
    color: theme.colors.textHint,
  },
  separator: {
    height: 15,
    backgroundColor: theme.colors.primaryBK,
  },
  actionSheetContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  actionSheetText: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.basic100,
  },
});
