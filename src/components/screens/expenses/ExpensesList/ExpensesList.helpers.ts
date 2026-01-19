import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { Transaction } from '@/types';

dayjs.extend(isBetween);

export interface TransactionSection {
  title: string;
  data: Transaction[];
}

export type TransactionFilter = 'all' | 'expense' | 'income';

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
