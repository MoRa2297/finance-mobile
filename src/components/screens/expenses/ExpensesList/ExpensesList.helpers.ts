import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { Transaction } from '@/types/types';

dayjs.extend(isBetween);

export interface TransactionSection {
  title: string;
  data: Transaction[];
}

export type TransactionFilter = 'all' | 'expense' | 'income';

/**
 * Filters transactions by month
 */
export const filterByMonth = (
  transactions: Transaction[],
  selectedDate: Dayjs | null,
): Transaction[] => {
  if (!transactions || !selectedDate) return transactions || [];

  const startDate = selectedDate.startOf('month');
  const endDate = selectedDate.endOf('month');

  return transactions.filter(t => {
    const date = dayjs(t.date);
    return date.isBetween(startDate, endDate, null, '[]');
  });
};

/**
 * Filters transactions by type
 */
export const filterByType = (
  transactions: Transaction[],
  filter: TransactionFilter,
): Transaction[] => {
  if (filter === 'all') return transactions;

  if (filter === 'expense') {
    return transactions.filter(
      t => t.type === 'expense' || t.type === 'card_spending',
    );
  }

  return transactions.filter(t => t.type === filter);
};

/**
 * Groups transactions by date for SectionList
 */
export const groupByDate = (
  transactions: Transaction[],
): TransactionSection[] => {
  const grouped = transactions.reduce<Record<string, TransactionSection>>(
    (acc, transaction) => {
      const dateKey = dayjs(transaction.date).format('DD-MM-YYYY');

      if (!acc[dateKey]) {
        acc[dateKey] = { title: dateKey, data: [] };
      }

      acc[dateKey].data.push(transaction);
      return acc;
    },
    {},
  );

  // Sort by date descending
  return Object.values(grouped).sort((a, b) => {
    const dateA = dayjs(a.title, 'DD-MM-YYYY');
    const dateB = dayjs(b.title, 'DD-MM-YYYY');
    return dateB.valueOf() - dateA.valueOf();
  });
};

/**
 * Calculates totals from transactions
 */
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
