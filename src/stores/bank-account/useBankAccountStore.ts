import { create } from 'zustand';
import { bankAccountService } from '@/services';
import { BankAccountState } from './bank-account.types';
import { BANK_ACCOUNT_INITIAL_STATE } from './bank-account.constants';
import { EditBankAccount } from '@/types';

export const useBankAccountStore = create<BankAccountState>()(set => ({
  ...BANK_ACCOUNT_INITIAL_STATE,

  fetchBankAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const bankAccounts = await bankAccountService.getBankAccounts();
      set({ bankAccounts, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load bank accounts';
      set({ isLoading: false, error: message });
    }
  },

  createBankAccount: async (payload: EditBankAccount) => {
    set({ isMutating: true, error: null });
    try {
      const bankAccount = await bankAccountService.createBankAccount(payload);
      set(state => ({
        bankAccounts: [...state.bankAccounts, bankAccount],
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create bank account';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  updateBankAccount: async (id: number, payload: EditBankAccount) => {
    set({ isMutating: true, error: null });
    try {
      const updated = await bankAccountService.updateBankAccount(id, payload);
      set(state => ({
        bankAccounts: state.bankAccounts.map(b => (b.id === id ? updated : b)),
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update bank account';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  deleteBankAccount: async (id: number) => {
    set({ isMutating: true, error: null });
    try {
      await bankAccountService.deleteBankAccount(id);
      set(state => ({
        bankAccounts: state.bankAccounts.filter(b => b.id !== id),
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete bank account';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  reset: () => set(BANK_ACCOUNT_INITIAL_STATE),
}));
