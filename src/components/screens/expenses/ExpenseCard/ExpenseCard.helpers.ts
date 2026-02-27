import { Transaction } from '@/types';

export interface ExpenseCardData {
  categoryName?: string;
  categoryIconName?: string;
  categoryColor?: string;
  accountName?: string;
  isRecurrent: boolean;
}

export const getExpenseCardData = (
  transaction: Transaction,
): ExpenseCardData => {
  return {
    categoryName: transaction.category?.name,
    categoryIconName: transaction.category?.categoryIcon?.iconName,
    categoryColor: transaction.category?.categoryColor?.hexCode,
    accountName: transaction.bankAccount?.name ?? transaction.card?.name,
    isRecurrent: transaction.recurrent,
  };
};

export const formatSubtitle = (
  data: ExpenseCardData,
  recurrentLabel: string,
): string => {
  const parts: string[] = [];

  if (data.categoryName) parts.push(data.categoryName);
  if (data.accountName) parts.push(data.accountName);
  if (data.isRecurrent) parts.push(recurrentLabel);

  return parts.join(' | ');
};
