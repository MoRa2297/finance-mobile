export type Transaction = {
  id: number;
  bankAccountId: number;
  categoryId: number;
  cardId: number;
  userId: number;
  money: string;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: 'income' | 'expense' | 'card_spending';
};

export type EditTransaction = {
  id?: number;
  bankAccountId: number | string;
  cardAccountId: number | string | null;
  categoryId: number | string;
  userId: number | string;
  money: number | string;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: 'income' | 'expense' | 'card_spending';
};

export enum TransactionFormTypes {
  INCOME = 'income',
  EXPENSE = 'expense',
  CARD_SPENDING = 'card_spending',
}
