import { BankAccount } from '@/types';

export const useBankAccountCard = (bankAccount: BankAccount) => {
  const imageUrl = bankAccount.bankType?.imageUrl ?? null;
  const currentBalance = bankAccount.startingBalance;
  // TODO: calcolare il balance reale con le transazioni

  return {
    bankType: bankAccount.bankType,
    currentBalance,
    imageUrl,
  };
};
