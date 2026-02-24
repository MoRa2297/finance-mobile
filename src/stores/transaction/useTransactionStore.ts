import { create } from 'zustand';
import { transactionService, TransactionFilters } from '@/services';
import { TransactionState } from './transaction.types';
import { TRANSACTION_INITIAL_STATE } from './transaction.constants';
import { EditTransaction } from '@/types';

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  ...TRANSACTION_INITIAL_STATE,

  fetchTransactions: async (filters?: TransactionFilters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const { data, meta } =
        await transactionService.getTransactions(activeFilters);
      set({ transactions: data, meta, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load transactions';
      set({ isLoading: false, error: message });
    }
  },

  createTransaction: async (payload: EditTransaction) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await transactionService.createTransaction(payload);
      set(state => ({
        transactions: [transaction, ...state.transactions],
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create transaction';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateTransaction: async (id: number, payload: EditTransaction) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await transactionService.updateTransaction(id, payload);
      set(state => ({
        transactions: state.transactions.map(t => (t.id === id ? updated : t)),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update transaction';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteTransaction: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.deleteTransaction(id);
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete transaction';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },

  reset: () => set(TRANSACTION_INITIAL_STATE),
}));
