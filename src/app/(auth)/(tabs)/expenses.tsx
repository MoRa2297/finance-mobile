import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SpecificPrice } from '@/components/screens/home';
import { ExpensesList } from '@/components/screens/expenses';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { SliderBar, Tab } from '@components/ui/SliderBar';
import { useExpensesScreen } from '@hooks/screens/expenses';
import { Alert } from '@components/ui/Alert';

export default function ExpensesScreen() {
  const { t } = useTranslation(['expensesPage', 'common']);
  const {
    tabs,
    handleSelectMonth,
    handleTabChange,
    user,
    filteredTransactions,
    totals,
    isLoading,
    formatAmount,
    moneyIsVisible,
    handleToggleMoneyVisibility,
    handleSelectTransaction,
    handleSelectRemoveTransaction,
    isAlertVisible,
    setIsAlertVisible,
    handleDeleteTransaction,
    selectedTransaction,
  } = useExpensesScreen();

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
        <SliderBar tabs={tabs} onTabChange={handleTabChange} />

        <ExpensesList
          transactions={filteredTransactions}
          loading={isLoading}
          onSelectTransaction={handleSelectTransaction}
          onDeleteTransaction={handleSelectRemoveTransaction}
        />
      </View>
      {/*<Alert*/}
      {/*  visible={isAlertVisible}*/}
      {/*  title={t('expensesPage:deleteTransactionTitle')}*/}
      {/*  subtitle={t('expensesPage:deleteTransactionMessage')}*/}
      {/*  primaryButtonText={t('common:delete')}*/}
      {/*  onPrimaryPress={() => setIsAlertVisible(false)}*/}
      {/*  onSecondaryPress={() =>*/}
      {/*    selectedTransaction && handleDeleteTransaction(selectedTransaction)*/}
      {/*  }*/}
      {/*  secondaryButtonText={t('common:cancel')}*/}
      {/*/>*/}
      <Alert
        visible={isAlertVisible}
        title={t('expensesPage:deleteTransactionTitle')}
        subtitle={t('expensesPage:deleteTransactionMessage')}
        primaryButtonText={t('common:cancel')}
        onPrimaryPress={() => setIsAlertVisible(false)}
        secondaryButtonText={t('common:delete')}
        onSecondaryPress={() => {
          if (selectedTransaction) {
            handleDeleteTransaction(selectedTransaction);
          }
        }}
      />
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
