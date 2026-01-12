import dayjs from 'dayjs';
import { SwipePickerMonth } from '@/types/types';

export const getMonths = (): SwipePickerMonth[] => {
  const months: SwipePickerMonth[] = [];
  const currentDate = dayjs();

  // Generate 12 months back and 12 months forward
  for (let i = -12; i <= 12; i++) {
    const date = currentDate.add(i, 'month');
    months.push({
      id: i + 12,
      date: date.toDate(),
      month: date.format('MMMM'),
      year: date.year(),
    });
  }

  return months;
};

export const formatCurrency = (amount: number, currency = '€'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};
