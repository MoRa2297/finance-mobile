import React, { useMemo, useCallback, FC } from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { Transaction } from '@/types';
import { groupByDate } from './ExpensesList.helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAV_HEIGHT } from '@config/constants';
import { EmptyData, LoadingSpinner } from '@components/common';
import { ExpenseCard } from '@components/screens/expenses';

interface IExpensesListProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  loading?: boolean;
}

export const ExpensesList: FC<IExpensesListProps> = ({
  transactions,
  loading = false,
  onSelectTransaction,
}) => {
  const { t } = useTranslation('expensesPage');
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => groupByDate(transactions), [transactions]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard transaction={item} onPress={onSelectTransaction} />
    ),
    [onSelectTransaction],
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
    () => <EmptyData title={t('expensesPage:emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback(
    (item: Transaction, index: number) => `${item.id}-${index}`,
    [],
  );

  const listContentStyle = useMemo(
    () => ({ paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom }),
    [insets.bottom],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          color={theme.colors.primary}
          backgroundColor={theme.colors.secondaryBK}
        />
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
      contentContainerStyle={[styles.contentContainer, listContentStyle]}
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
    backgroundColor: theme.colors.secondaryBK,
  },
});
