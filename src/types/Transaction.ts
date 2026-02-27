export type TransactionType = 'income' | 'expense' | 'card_expense';

export type Transaction = {
  id: number;
  userId: number;
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
  CARD_EXPENSE = 'card_expense',
}
