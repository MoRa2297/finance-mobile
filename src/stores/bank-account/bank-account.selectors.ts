import { BankAccountState } from './bank-account.types';

export const bankAccountSelectors = {
  bankAccounts: (state: BankAccountState) => state.bankAccounts,
  isLoading: (state: BankAccountState) => state.isLoading,
  isMutating: (state: BankAccountState) => state.isMutating,
  error: (state: BankAccountState) => state.error,
};
