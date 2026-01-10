import { Transaction, Category, BankAccount, BankCard } from '@/types/types';

export interface ExpenseCardData {
  category?: Category;
  bankAccount?: BankAccount;
  bankCard?: BankCard;
}

export const getExpenseCardData = (
  transaction: Transaction,
  categories: Category[],
  bankAccounts: BankAccount[],
  bankCards: BankCard[],
): ExpenseCardData => {
  const category = categories.find(c => c.id === transaction.categoryId);
  const bankAccount = bankAccounts.find(
    b => b.id === transaction.bankAccountId,
  );
  const bankCard = bankCards.find(c => c.id === transaction.cardId);

  return { category, bankAccount, bankCard };
};

export const formatSubtitle = (
  data: ExpenseCardData,
  isRecurrent: boolean,
  recurrentLabel: string,
): string => {
  const parts: string[] = [];

  if (data.category?.name) {
    parts.push(data.category.name);
  }

  if (data.bankAccount?.name) {
    parts.push(data.bankAccount.name);
  } else if (data.bankCard?.name) {
    parts.push(data.bankCard.name);
  }

  if (isRecurrent) {
    parts.push(recurrentLabel);
  }

  return parts.join(' | ');
};
