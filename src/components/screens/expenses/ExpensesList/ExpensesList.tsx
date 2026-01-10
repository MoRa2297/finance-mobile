import React, { useMemo, useCallback } from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';

import { theme } from '@/config/theme';
import { Transaction, Category, BankAccount, BankCard } from '@/types/types';

import { ExpenseCard } from '../ExpenseCard';
import {
  TransactionFilter,
  filterByMonth,
  filterByType,
  groupByDate,
} from './ExpensesList.helpers';
import { EmptyData } from '@components/ui/EmptyData';
import { LoadingSpinner } from '@/components';

interface ExpensesListProps {
  transactions: Transaction[];
  categories: Category[];
  bankAccounts: BankAccount[];
  bankCards: BankCard[];
  selectedDate: Dayjs | null;
  filter: TransactionFilter;
  loading?: boolean;
  onSelectTransaction: (transaction: Transaction) => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({
  transactions,
  categories,
  bankAccounts,
  bankCards,
  selectedDate,
  filter,
  loading = false,
  onSelectTransaction,
}) => {
  const { t } = useTranslation();

  // Filter and group transactions
  const sections = useMemo(() => {
    const byMonth = filterByMonth(transactions, selectedDate);
    const byType = filterByType(byMonth, filter);
    return groupByDate(byType);
  }, [transactions, selectedDate, filter]);

  // Render helpers
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard
        transaction={item}
        categories={categories}
        bankAccounts={bankAccounts}
        bankCards={bankCards}
        onPress={onSelectTransaction}
      />
    ),
    [categories, bankAccounts, bankCards, onSelectTransaction],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <Text category="p1" style={styles.sectionHeader}>
        {section.title}
      </Text>
    ),
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmpty = useCallback(
    () => <EmptyData title={t('screens.expensesScreen.emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback(
    (item: Transaction, index: number) => `${item.id}-${index}`,
    [],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner color={theme.colors.basic100} size="large" />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 17,
    backgroundColor: theme.colors.secondaryBK,
    paddingVertical: 10,
    color: theme.colors.textHint,
  },
  separator: {
    height: 15,
    backgroundColor: theme.colors.secondaryBK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
