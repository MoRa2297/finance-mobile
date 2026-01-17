import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Dayjs } from 'dayjs';

import { Header, ScreenContainer, TopRoundedContainer } from '@/components/ui';

import {
  BalanceSummary,
  calculateBalance,
  MonthItem,
  MonthPopover,
} from '@/components/screens';
import { useDataStore, useUIStore, useAuthStore } from '@/stores';
import { theme } from '@/config/theme';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Stores
  const user = useAuthStore(state => state.user);
  const transactions = useDataStore(state => state.transactions);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const toggleMoneyVisibility = useUIStore(
    state => state.toggleMoneyVisibility,
  );

  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  // Calculate balance based on selected month
  const balance = useMemo(
    () => calculateBalance(transactions, bankAccounts, selectedDate),
    [transactions, bankAccounts, selectedDate],
  );

  // Handlers
  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleToggleMoneyVisibility = useCallback(() => {
    setMoneyIsVisible();
  }, [setMoneyIsVisible]);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <TopRoundedContainer height={'35%'} paddingTop={10}>
        <Header
          left={{
            type: 'avatar',
            source: user?.imageUrl,
            onPress: () => {},
          }}
          center={{
            type: 'custom',
            render: () => <MonthPopover onSelectMonth={handleSelectMonth} />,
          }}
          right={{
            type: 'visibility',
            isVisible: moneyIsVisible,
            onToggle: handleToggleMoneyVisibility,
          }}
        />
        <BalanceSummary balance={balance} moneyIsVisible={moneyIsVisible} />
      </TopRoundedContainer>

      {/* TODO: Add transactions list, charts, etc. */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
});
