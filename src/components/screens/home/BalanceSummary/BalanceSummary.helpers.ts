// components/screens/home/calculateBalance.ts
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { BankAccount, Transaction } from '@/types';

dayjs.extend(isBetween);

export interface BalanceData {
  totalIncome: number;
  totalExpense: number;
  totalResidue: number;
}

export const DEFAULT_BALANCE: BalanceData = {
  totalIncome: 0,
  totalExpense: 0,
  totalResidue: 0,
};

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  selectedDate: Dayjs | null,
): Transaction[] => {
  if (!transactions?.length) return [];
  if (!selectedDate) return transactions;

  const startDate = selectedDate.startOf('month');
  const endDate = selectedDate.endOf('month');

  return transactions.filter(t =>
    dayjs(t.date).isBetween(startDate, endDate, null, '[]'),
  );
};

export const calculateBalance = (
  allTransactions: Transaction[],
  monthTransactions: Transaction[],
  bankAccounts: BankAccount[],
  selectedDate: Dayjs | null,
): BalanceData => {
  if (!allTransactions || !bankAccounts) return DEFAULT_BALANCE;

  // Income and expense for selected month only
  const totalIncome = monthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  // Residue = startingBalance + all income ever - all expenses ever
  // up to end of selected month
  const relevantTransactions = selectedDate
    ? allTransactions.filter(t =>
        dayjs(t.date).isBefore(selectedDate.endOf('month').add(1, 'day')),
      )
    : allTransactions;

  const startingBalance = bankAccounts.reduce(
    (sum, a) => sum + a.startingBalance,
    0,
  );
  const allIncome = relevantTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const allExpense = relevantTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalResidue = startingBalance + allIncome - allExpense;

  return { totalIncome, totalExpense, totalResidue };
};

export const formatMoney = (amount: number, visible: boolean): string => {
  if (!visible) return '--';
  return `${amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €`;
};
