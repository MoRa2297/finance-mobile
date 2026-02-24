import { BankAccountState } from './bank-account.types';

export const bankAccountSelectors = {
  bankAccounts: (state: BankAccountState) => state.bankAccounts,
  isLoading: (state: BankAccountState) => state.isLoading,
  error: (state: BankAccountState) => state.error,
};
