import { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';

import { useAuthStore, useUIStore } from '@/stores';
import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import { useTransactions } from '@/stores/transaction/transaction.queries';
import { calculateBalance } from '@components/screens/home';
import { TransactionFilters } from '@/types';

const CURRENT_MONTH = dayjs();

const MONTH_FILTERS: TransactionFilters = {
  month: CURRENT_MONTH.month() + 1,
  year: CURRENT_MONTH.year(),
};

export const useHomeScreen = () => {
  const user = useAuthStore(state => state.user);
  const moneyIsVisible = useUIStore(state => state.moneyIsVisible);
  const setMoneyIsVisible = useUIStore(state => state.setMoneyIsVisible);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  const { data: bankAccounts = [] } = useBankAccounts();

  const { data: allTransactionData } = useTransactions({});
  const allTransactions = allTransactionData?.transactions ?? [];

  const { data: monthTransactionData } = useTransactions(MONTH_FILTERS);
  const monthTransactions = monthTransactionData?.transactions ?? [];

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const balance = useMemo(
    () =>
      calculateBalance(
        allTransactions,
        monthTransactions,
        bankAccounts,
        CURRENT_MONTH,
      ),
    [allTransactions, monthTransactions, bankAccounts],
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleToggleMoneyVisibility = useCallback(() => {
    setMoneyIsVisible();
  }, [setMoneyIsVisible]);

  return {
    user,
    balance,
    moneyIsVisible,
    handleToggleMoneyVisibility,
  };
};
