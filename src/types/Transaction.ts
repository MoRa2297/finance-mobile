import { Category } from './Category';
import { BankAccount } from './BankAccount';
import { BankCard } from './BankCard';
import { Frequency } from './Frequency';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type TransferDetail = {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  fromAccount: BankAccount;
  toAccount: BankAccount;
};

export type Transaction = {
  id: number;
  userId: number | null;
  bankAccountId: number | null;
  cardAccountId: number | null;
  categoryId: number | null;
  money: number;
  date: string;
  description: string;
  recurrent: boolean;
  note: string;
  type: TransactionType;
  category: Category | null;
  bankAccount: BankAccount | null;
  card: BankCard | null;
  transferFrom: TransferDetail | null;
  transferTo: TransferDetail | null;
};

export type CreateTransactionPayload = {
  bankAccountId?: number;
  cardAccountId?: number;
  categoryId?: number;
  money: number;
  date: string;
  description: string;
  recurrent: boolean;
  frequency?: Frequency;
  recurrenceEndDate?: string;
  note: string;
  type: TransactionType;
};

export type CreateTransferPayload = {
  money: number;
  date: string;
  description: string;
  note?: string;
  fromAccountId: number;
  toAccountId: number;
};

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export type TransactionFilters = {
  month?: number;
  year?: number;
  categoryId?: number;
  type?: TransactionType;
  bankAccountId?: number;
  cardAccountId?: number;
  page?: number;
  limit?: number;
};

export type TransactionMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export enum TransactionFormTypes {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}
