import { Transaction } from '@/types';
import dayjs from 'dayjs';
import { RecurrenceValues } from '@components/ui/RecurrenceSelector/RecurrenceSelector';

export const DATE_FORMAT = 'DD-MM-YYYY';

export const parseDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export const buildRecurrenceFromTransaction = (
  transaction: Transaction,
): RecurrenceValues => ({
  recurrent: transaction.recurrent,
  frequency: transaction.recurringRule?.frequency ?? null,
  endDate: transaction.recurringRule?.endDate
    ? dayjs(transaction.recurringRule.endDate).format(DATE_FORMAT)
    : null,
});
