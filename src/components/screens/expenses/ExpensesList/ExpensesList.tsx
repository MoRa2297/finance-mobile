import React, { useMemo, useCallback, FC } from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/config/theme';
import { Transaction } from '@/types';
import { BOTTOM_NAV_HEIGHT } from '@config/constants';
import { EmptyData, LoadingSpinner } from '@components/common';
import { ExpenseCard } from '../ExpenseCard';
import { groupByDate } from './ExpensesList.helpers';

interface IExpensesListProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
  onAddTransaction?: () => void;
  loading?: boolean;
}

export const ExpensesList: FC<IExpensesListProps> = ({
  transactions,
  loading = false,
  onSelectTransaction,
  onDeleteTransaction,
  onAddTransaction,
}) => {
  const { t } = useTranslation('expensesPage');
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => groupByDate(transactions), [transactions]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard
        transaction={item}
        onPress={onSelectTransaction}
        onDelete={onDeleteTransaction}
      />
    ),
    [onSelectTransaction, onDeleteTransaction],
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
    () => (
      <EmptyData
        variant="centered"
        iconName="swap-outline"
        title={t('expensesPage:empty.title')}
        subtitle={t('expensesPage:empty.subtitle')}
        action={
          onAddTransaction
            ? {
                label: t('expensesPage:empty.cta'),
                onPress: onAddTransaction,
              }
            : undefined
        }
      />
    ),
    [t, onAddTransaction],
  );

  const keyExtractor = useCallback(
    (item: Transaction, index: number) => `${item.id}-${index}`,
    [],
  );

  const listContentStyle = useMemo(
    () => ({
      paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom,
    }),
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

  const isEmpty = transactions.length === 0;

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
      contentContainerStyle={[
        styles.contentContainer,
        isEmpty && styles.contentContainerEmpty,
        listContentStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  contentContainerEmpty: {
    justifyContent: 'center',
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
