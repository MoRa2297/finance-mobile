import { Frequency } from './Frequency';
import { BankAccount } from './BankAccount';

export type RecurringRule = {
  id: number;
  amount: number;
  description: string;
  note: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  frequency: Frequency;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
  dayOfWeek: string | null;
  lastGeneratedDate: string | null;
  categoryId: number | null;
  bankAccountId: number | null;
  cardAccountId: number | null;
  fromAccountId: number | null;
  toAccountId: number | null;
  fromAccount: BankAccount | null;
  toAccount: BankAccount | null;
};
