import { Transaction } from '@/types';
import { theme } from '@/config/theme';

export interface ExpenseCardData {
  categoryName?: string;
  categoryIconName?: string;
  categoryColor?: string;
  accountName?: string;
  isRecurrent: boolean;
  isTransfer: boolean;
  isIncome: boolean;
  isExpense: boolean;
  transferFromAccount?: string;
  transferToAccount?: string;
  amountColor: string;
  amountPrefix: string;
  iconName: string;
  iconBackgroundColor: string;
}

export const getExpenseCardData = (
  transaction: Transaction,
): ExpenseCardData => {
  const isTransfer = transaction.type === 'TRANSFER';
  const isIncome = transaction.type === 'INCOME';
  const isExpense = transaction.type === 'EXPENSE';

  return {
    categoryName: transaction.category?.name,
    categoryIconName: transaction.category?.categoryIcon?.iconName,
    categoryColor: transaction.category?.categoryColor?.hexCode,
    accountName: transaction.bankAccount?.name ?? transaction.card?.name,
    isRecurrent: transaction.recurrent,
    isTransfer,
    isIncome,
    isExpense,
    transferFromAccount: transaction.transferDetail?.fromAccount?.name,
    transferToAccount: transaction.transferDetail?.toAccount?.name,
    // Amount styling
    amountColor: isIncome
      ? theme.colors.green
      : isExpense
        ? theme.colors.red
        : theme.colors.textHint,
    amountPrefix: isIncome ? '+' : isExpense ? '-' : '',
    // Icon
    iconName: isTransfer
      ? 'swap-outline'
      : (transaction.category?.categoryIcon?.iconName ?? 'cube-outline'),
    iconBackgroundColor: isTransfer
      ? theme.colors.primary
      : (transaction.category?.categoryColor?.hexCode ?? theme.colors.primary),
  };
};

export const formatSubtitle = (data: ExpenseCardData): string => {
  if (data.isTransfer && data.transferFromAccount && data.transferToAccount) {
    return `${data.transferFromAccount} → ${data.transferToAccount}`;
  }

  const parts: string[] = [];
  if (data.categoryName) parts.push(data.categoryName);
  if (data.accountName) parts.push(data.accountName);
  return parts.join(' | ');
};
