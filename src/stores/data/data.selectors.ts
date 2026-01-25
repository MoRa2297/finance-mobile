import { DataStore } from '@/stores';
import {
  Transaction,
  BankAccount,
  Category,
  BankType,
  BankAccountType,
} from '@/types';
import dayjs, { Dayjs } from 'dayjs';

// ============ Base Selectors ============
export const selectTransactions = (state: DataStore) => state.transactions;
export const selectBankAccounts = (state: DataStore) => state.bankAccounts;
export const selectIsLoading = (state: DataStore) => state.isLoading;

// ============ Transaction Filters ============
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

export const filterTransactionsByType = (
  transactions: Transaction[],
  type: string,
): Transaction[] => {
  if (type === 'all') return transactions;
  return transactions.filter(t => t.type === type);
};

// ============ Calculations ============
export const calculateTotals = (
  transactions: Transaction[],
): { income: number; expense: number; balance: number } => {
  const received = transactions.filter(t => t.recived);

  const income = received
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  const expense = received
    .filter(t => t.type === 'expense' || t.type === 'card_spending')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  return { income, expense, balance: income - expense };
};

export const calculateTotalStartingBalance = (
  accounts: BankAccount[],
): number => {
  return accounts.reduce((sum, account) => sum + account.startingBalance, 0);
};

export const calculateResidue = (
  transactions: Transaction[],
  bankAccounts: BankAccount[],
): number => {
  const { income, expense } = calculateTotals(transactions);
  const startingBalance = calculateTotalStartingBalance(bankAccounts);
  return startingBalance + income - expense;
};

// ============ Combined Filters ============
export const filterTransactions = (
  transactions: Transaction[],
  date: Dayjs | null,
  type: string = 'all',
): Transaction[] => {
  const byMonth = filterTransactionsByMonth(transactions, date);
  return filterTransactionsByType(byMonth, type);
};

// ============ Category Selectors ============
export const selectCategories = (state: DataStore) => state.categories;

export const selectCategoriesByType = (
  categories: Category[],
  type: 'income' | 'expenses',
): Category[] => {
  return categories.filter(cat => cat.type === type);
};

export const selectIncomeCategories = (state: DataStore) =>
  state.categories.filter(cat => cat.type === 'income');

export const selectExpenseCategories = (state: DataStore) =>
  state.categories.filter(cat => cat.type === 'expenses');

// ============ Bank Account Selectors ============
export const selectBankTypes = (state: DataStore) => state.bankTypes;

export const findBankTypeById = (
  bankTypes: BankType[],
  bankTypeId: number,
): BankType | undefined => {
  return bankTypes.find(bt => bt.id === bankTypeId);
};

export const calculateAccountBalance = (
  account: BankAccount,
  transactions: Transaction[],
): number => {
  const accountTransactions = transactions.filter(
    t => t.bankAccountId === account.id && t.recived,
  );

  const totIncome = accountTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  const totExpense = accountTransactions
    .filter(t => t.type === 'expense' || t.type === 'card_spending')
    .reduce((sum, t) => sum + parseFloat(t.money || '0'), 0);

  return account.startingBalance + totIncome - totExpense;
};

// ============ Bank Account Detail Selectors ============
export const selectBankAccountTypes = (state: DataStore) =>
  state.bankAccountTypes;

export const findBankAccountById = (
  bankAccounts: BankAccount[],
  id: number,
): BankAccount | undefined => {
  return bankAccounts.find(ba => ba.id === id);
};

export const findBankAccountTypeById = (
  bankAccountTypes: BankAccountType[],
  id: number,
): BankAccountType | undefined => {
  return bankAccountTypes.find(bat => bat.id === id);
};

export interface AccountStats {
  totIncome: number;
  totSpent: number;
  currentBalance: number;
  countIncome: number;
  countSpent: number;
  totalTransfers: number;
}

export const calculateAccountStats = (
  account: BankAccount | undefined,
  transactions: Transaction[],
): AccountStats => {
  const emptyStats: AccountStats = {
    totIncome: 0,
    totSpent: 0,
    currentBalance: 0,
    countIncome: 0,
    countSpent: 0,
    totalTransfers: 0,
  };

  if (!account) return emptyStats;

  const accountTransactions = transactions.filter(
    t => t.bankAccountId === account.id && t.recived,
  );

  const incomeTransactions = accountTransactions.filter(
    t => t.type === 'income',
  );
  const expenseTransactions = accountTransactions.filter(
    t => t.type === 'expense' || t.type === 'card_spending',
  );

  const totIncome = incomeTransactions.reduce(
    (sum, t) => sum + parseFloat(t.money || '0'),
    0,
  );
  const totSpent = expenseTransactions.reduce(
    (sum, t) => sum + parseFloat(t.money || '0'),
    0,
  );

  return {
    totIncome,
    totSpent,
    currentBalance: account.startingBalance + totIncome - totSpent,
    countIncome: incomeTransactions.length,
    countSpent: expenseTransactions.length,
    totalTransfers: incomeTransactions.length + expenseTransactions.length,
  };
};
