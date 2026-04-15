import { TransactionFormTypes, TransactionType } from '@/types';

export type CreateableTransactionType = Extract<
  TransactionType,
  'INCOME' | 'EXPENSE'
>;

export const isCreateableType = (
  type: TransactionFormTypes,
): type is TransactionFormTypes & CreateableTransactionType =>
  type === TransactionFormTypes.INCOME || type === TransactionFormTypes.EXPENSE;
