import { DataStore } from '@/stores';
import { Transaction } from '@/types';
import dayjs, { Dayjs } from 'dayjs';
import { TransactionType } from '@components/ui/BottomNavigation/BottomNavigation.helpers';

// export const selectHasBeenInitiated = (state: DataStore) => state.hasBeenInitiated;
// export const selectColors = (state: DataStore) => state.colors;
// export const selectCategoryIcon = (state: DataStore) => state.categoryIcon;
// export const selectCategories = (state: DataStore) => state.categories;
// export const selectBankTypes = (state: DataStore) => state.bankTypes;
// export const selectBankAccountType = (state: DataStore) => state.bankAccountType;
// export const selectBankAccount = (state: DataStore) => state.bankAccount;
// export const selectCardTypes = (state: DataStore) => state.cardTypes;
// export const selectBankCard = (state: DataStore) => state.bankCard;
// export const selectTransactions = (state: DataStore) => state.transactions;
//
// // Derived selectors
// export const selectIncomeCategories = (state: DataStore) =>
//     state.categories.filter((cat) => cat.type === 'income');
//
// export const selectExpenseCategories = (state: DataStore) =>
//     state.categories.filter((cat) => cat.type === 'expenses');

// Filter by month
export const filterTransactionsByMonth = (
  transactions: Transaction[],
  date: Dayjs | null,
): Transaction[] => {
  if (!date) return transactions;

  return transactions.filter(t => {
    const txDate = dayjs(t.date);
    return txDate.month() === date.month() && txDate.year() === date.year();
  });
};

// Filter by type
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: string,
): Transaction[] => {
  if (type === 'all') return transactions;
  return transactions.filter(t => t.type === type);
};

// Calculate totals
export const calculateTotals = (
  transactions: Transaction[],
): { income: number; expense: number } => {
  const received = transactions.filter(t => t.recived);

  const income = received
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  const expense = received
    .filter(t => t.type === 'expense' || t.type === 'card_spending')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  return { income, expense };
};

// Combined filter (utility)
export const filterTransactions = (
  transactions: Transaction[],
  date: Dayjs | null,
  type: string, // todo fix with correct types when split store logic
): Transaction[] => {
  const byMonth = filterTransactionsByMonth(transactions, date);
  return filterTransactionsByType(byMonth, type);
};
