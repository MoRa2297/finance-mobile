import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Header,
  MonthSwipePicker,
  ScreenContainer,
  SliderBar,
  Tab,
  TopRoundedContainer,
} from '@/components/ui';
import { MonthItem, SpecificPrice } from '@/components/screens/home';
import { ExpensesList } from '@/components/screens/expenses';
import { useDataStore, useUIStore, useAuthStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import {
  calculateTotals,
  filterTransactions,
  filterTransactionsByMonth,
} from '@stores/data/data.selectors';
import { SheetManager } from 'react-native-actions-sheet';
import { router } from 'expo-router';

const TABS: Tab[] = [
  { title: 'expensesPage:tabs.all', value: 'all' },
  { title: 'expensesPage:tabs.expenses', value: 'expense' },
  { title: 'expensesPage:tabs.income', value: 'income' },
];

// TODO add the open function
export default function ExpensesScreen() {
  const { t } = useTranslation('expensesPage');

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const [selectedTab, setSelectedTab] = useState(TABS[0].value);

  // Stores
  const user = useAuthStore(state => state.user);
  const transactions = useDataStore(state => state.transactions);
  const categories = useDataStore(state => state.categories);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankCards = useDataStore(state => state.bankCards);
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  // Derived data - usa selectors
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, selectedDate, selectedTab),
    [transactions, selectedDate, selectedTab],
  );

  // Calculate totals for selected month
  const totals = useMemo(
    () =>
      calculateTotals(filterTransactionsByMonth(transactions, selectedDate)),
    [transactions, selectedDate],
  );

  // Handlers
  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  const handleSelectTransaction = useCallback((transaction: any) => {
    console.log('Selected transaction:', transaction);
    // TODO transaction-detail-sheet
    // await SheetManager.show('transaction-detail-sheet', {
    //   payload: {
    //     transaction: transaction,
    //     handleEdit: handleEdit,
    //   },
    // });

    SheetManager.show('transaction-detail-sheet', {
      payload: {
        transaction,
        onEdit: tx => {
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
        <SliderBar tabs={TABS} onTabChange={handleTabChange} />

        <ExpensesList
          transactions={filteredTransactions}
          categories={categories}
          bankAccounts={bankAccounts}
          bankCards={bankCards}
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
