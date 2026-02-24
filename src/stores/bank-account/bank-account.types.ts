import { BankAccount, EditBankAccount } from '@/types';

export interface BankAccountState {
  bankAccounts: BankAccount[];
  isLoading: boolean;
  error: string | null;

  fetchBankAccounts: () => Promise<void>;
  createBankAccount: (payload: EditBankAccount) => Promise<void>;
  updateBankAccount: (id: number, payload: EditBankAccount) => Promise<void>;
  deleteBankAccount: (id: number) => Promise<void>;
  reset: () => void;
}
