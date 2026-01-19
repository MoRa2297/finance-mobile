import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Header,
  MonthSwipePicker,
  ScreenContainer,
  TopRoundedContainer,
} from '@/components/ui';
import {
  MonthItem,
  MonthPopover,
  SpecificPrice,
} from '@/components/screens/home';
import { ExpensesList, TransactionFilter } from '@/components/screens/expenses';
import {
  filterByMonth,
  calculateTotals,
} from '@/components/screens/expenses/ExpensesList/ExpensesList.helpers';
import { useDataStore, useUIStore, useAuthStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { SwipePickerMonth } from '@/types';

export default function ExpensesScreen() {
  const { t } = useTranslation();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>('all');

  // Stores
  const user = useAuthStore(state => state.user);
  const transactions = useDataStore(state => state.transactions);
  const categories = useDataStore(state => state.categories);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankCards = useDataStore(state => state.bankCards);
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  // Calculate totals for selected month
  const totals = useMemo(() => {
    const filtered = filterByMonth(transactions, selectedDate);
    return calculateTotals(filtered);
  }, [transactions, selectedDate]);

  // Handlers
  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilter(value as TransactionFilter);
  }, []);

  const handleSelectTransaction = useCallback((transaction: any) => {
    console.log('Selected transaction:', transaction);
  }, []);

  const handleToggleMoneyVisibility = useCallback(() => {
    setMoneyIsVisible();
  }, [setMoneyIsVisible]);

  const formatAmount = (amount: number) => {
    return moneyIsVisible ? `${amount.toFixed(2)} €` : '--';
  };

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header Section */}
      <TopRoundedContainer height="28%" paddingTop={10}>
        <Header
          left={{
            type: 'avatar',
            source: user?.imageUrl,
            onPress: () => {},
          }}
          right={{
            type: 'visibility',
            isVisible: moneyIsVisible,
            onToggle: handleToggleMoneyVisibility,
          }}
        />

        <View style={styles.headerContent}>
          {/* Month Picker */}
          <View style={styles.monthPickerContainer}>
            <MonthSwipePicker
              onSelectMonth={handleSelectMonth}
              containerWidth={150}
              showArrows
            />
          </View>

          {/* Income / Expense Summary */}
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

      {/* Body Section */}
      <View style={styles.bodyContainer}>
        {/*<MonthSwipePicker*/}
        {/*  tabs={DEFAULT_TABS}*/}
        {/*  onTabChange={handleFilterChange}*/}
        {/*/>*/}

        <ExpensesList
          transactions={transactions}
          categories={categories}
          bankAccounts={bankAccounts}
          bankCards={bankCards}
          selectedDate={selectedDate}
          filter={filter}
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
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.transparent,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
    backgroundColor: theme.colors.secondaryBK,
  },
});
