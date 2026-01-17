import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { BankAccount, Transaction } from '@/types';

dayjs.extend(isBetween);

// TODO check when logic will be totally done

export interface BalanceData {
  totalIncome: number;
  totalExpense: number;
  totalResidue: number;
}

/**
 * Default balance when no data
 */
export const DEFAULT_BALANCE: BalanceData = {
  totalIncome: 0,
  totalExpense: 0,
  totalResidue: 0,
};

/**
 * Filters transactions by selected month
 */
export const filterTransactionsByMonth = (
  transactions: Transaction[],
  selectedDate: Dayjs | null,
): Transaction[] => {
  if (!transactions || transactions.length === 0) return [];
  if (!selectedDate) return transactions;

  const startDate = selectedDate.startOf('month');
  const endDate = selectedDate.endOf('month');

  return transactions.filter(transaction => {
    const transactionDate = dayjs(transaction.date);
    return transactionDate.isBetween(startDate, endDate, null, '[]');
  });
};

/**
 * Calculates balance summary from transactions
 */
export const calculateBalance = (
  transactions: Transaction[] | undefined,
  bankAccounts: BankAccount[] | undefined,
  selectedDate: Dayjs | null,
): BalanceData => {
  // Guard clauses
  if (!transactions || !bankAccounts) {
    return DEFAULT_BALANCE;
  }

  const filtered = filterTransactionsByMonth(transactions, selectedDate);

  const receivedTransactions = filtered.filter(t => t.recived);

  const totalIncome = receivedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  const totalExpense = receivedTransactions
    .filter(t => t.type === 'expense' || t.type === 'card_spending')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  const startingBalance = bankAccounts.reduce(
    (sum, account) => sum + (account.startingBalance || 0),
    0,
  );

  const totalResidue = startingBalance + totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    totalResidue,
  };
};

/**
 * Formats money for display
 */
export const formatMoney = (amount: number, visible: boolean): string => {
  if (!visible) return '--';
  return `${amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €`;
};
