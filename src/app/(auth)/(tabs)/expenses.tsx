import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import { MonthItem, SpecificPrice } from '@/components/screens/home';
import { ExpensesList } from '@/components/screens/expenses';
import {
  useTransactionStore,
  transactionSelectors,
  useUIStore,
  useAuthStore,
} from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { Transaction, TransactionType } from '@/types';
import { SheetManager } from 'react-native-actions-sheet';
import { router } from 'expo-router';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { SliderBar, Tab } from '@components/ui/SliderBar';

const TABS: Tab[] = [
  { title: 'expensesPage:tabs.all', value: 'all' },
  { title: 'expensesPage:tabs.expenses', value: 'EXPENSE' },
  { title: 'expensesPage:tabs.income', value: 'INCOME' },
];

export default function ExpensesScreen() {
  const { t } = useTranslation('expensesPage');

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTab, setSelectedTab] = useState(TABS[0].value);

  const user = useAuthStore(state => state.user);
  const transactions = useTransactionStore(transactionSelectors.transactions);
  const isLoading = useTransactionStore(transactionSelectors.isLoading);
  const fetchTransactions = useTransactionStore(
    state => state.fetchTransactions,
  );
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  useEffect(() => {
    const filters: Record<string, any> = {};
    if (selectedDate) {
      filters.month = selectedDate.month() + 1;
      filters.year = selectedDate.year();
    }
    fetchTransactions(filters);
  }, [selectedDate, fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedTab === 'all') return transactions;
    return transactions.filter(t => t.type === selectedTab);
  }, [transactions, selectedTab]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'INCOME') acc.income += t.amount;
        else if (t.type === 'EXPENSE') acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  const handleSelectTransaction = useCallback((transaction: Transaction) => {
    SheetManager.show('transaction-detail-sheet', {
      payload: {
        transaction,
        onEdit: (tx: Transaction) => {
          SheetManager.hide('transaction-detail-sheet');
          router.push({
            pathname: '/transaction',
            params: { id: tx.id, mode: 'edit' },
          });
        },
      },
    });
  }, []);

  const handleToggleMoneyVisibility = useCallback(() => {
    setMoneyIsVisible();
  }, [setMoneyIsVisible]);

  const formatAmount = useCallback(
    (amount: number) => (moneyIsVisible ? `${amount.toFixed(2)} €` : '--'),
    [moneyIsVisible],
  );

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <TopRoundedContainer height="28%" paddingTop={10}>
        <Header
          left={{
            type: 'avatar',
            source: user?.imageUrl || undefined,
            onPress: () => {},
          }}
          right={{
            type: 'visibility',
            isVisible: moneyIsVisible,
            onToggle: handleToggleMoneyVisibility,
          }}
        />

        <View style={styles.headerContent}>
          <View style={styles.monthPickerContainer}>
            <MonthSwipePicker
              onSelectMonth={handleSelectMonth}
              containerWidth={150}
              showArrows
            />
          </View>

          <View style={styles.summaryContainer}>
            <SpecificPrice
              title={t('expensesPage:income')}
              amount={formatAmount(totals.income)}
              amountColor={theme.colors.green}
              iconName="arrow-circle-down"
              iconColor={theme.colors.green}
            />
            <SpecificPrice
              title={t('expensesPage:spent')}
              amount={formatAmount(totals.expense)}
              amountColor={theme.colors.red}
              iconName="arrow-circle-up"
              iconColor={theme.colors.red}
            />
          </View>
        </View>
      </TopRoundedContainer>

      <View style={styles.bodyContainer}>
        <SliderBar tabs={TABS} onTabChange={handleTabChange} />

        <ExpensesList
          transactions={filteredTransactions}
          loading={isLoading}
          onSelectTransaction={handleSelectTransaction}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: theme.colors.transparent,
  },
  monthPickerContainer: {
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
  },
});
