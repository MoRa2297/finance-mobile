import { Category } from './Category';
import { BankAccount } from './BankAccount';
import { BankCard } from './BankCard';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type Transaction = {
  id: number;
  userId: number | null;
  bankAccountId: number | null;
  cardAccountId: number | null;
  categoryId: number;
  money: number;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: TransactionType;
  category: Category | null;
  bankAccount: BankAccount | null;
  card: BankCard | null;
};

export type CreateTransactionPayload = {
  bankAccountId?: number;
  cardAccountId?: number | null;
  categoryId: number;
  money: number;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: TransactionType;
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
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}
