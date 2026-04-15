import { useMemo } from 'react';
import { BankAccount, Transaction } from '@/types';

export const useBankAccountCard = (
  bankAccount: BankAccount,
  allTransactions: Transaction[] = [],
) => {
  const imageUrl = bankAccount.bankType?.imageUrl ?? null;

  // Real balance = startingBalance + all income - all expenses for this account
  const currentBalance = useMemo(() => {
    const accountTransactions = allTransactions.filter(
      t => t.bankAccountId === bankAccount.id,
    );
    const income = accountTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = accountTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return bankAccount.startingBalance + income - expense;
  }, [bankAccount, allTransactions]);

  return {
    bankType: bankAccount.bankType,
    currentBalance,
    imageUrl,
  };
};
