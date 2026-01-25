import { useMemo } from 'react';
import { useDataStore } from '@/stores';
import {
  selectTransactions,
  selectBankTypes,
  findBankTypeById,
  calculateAccountBalance,
} from '@/stores/data/data.selectors';
import { BankAccount } from '@/types';

export const useBankAccountCard = (bankAccount: BankAccount) => {
  const transactions = useDataStore(selectTransactions);
  const bankTypes = useDataStore(selectBankTypes);

  const bankType = useMemo(
    () => findBankTypeById(bankTypes, bankAccount.bankTypeId),
    [bankTypes, bankAccount.bankTypeId],
  );

  const currentBalance = useMemo(
    () => calculateAccountBalance(bankAccount, transactions),
    [bankAccount, transactions],
  );

  return {
    bankType,
    currentBalance,
    imageUrl:
      bankType?.imageUrl ??
      'https://placehold.co/80x80/1a1a2e/ffffff?text=Bank',
  };
};
