import { create } from 'zustand';
import { transactionService } from '@/services';
import { TransactionState } from './transaction.types';
import { TRANSACTION_INITIAL_STATE } from './transaction.constants';
import {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilters,
} from '@/types';

export const useTransactionStore = create<TransactionState>()(set => ({
  ...TRANSACTION_INITIAL_STATE,

  fetchTransactions: async (filters: TransactionFilters = {}) => {
    set({ isLoading: true, error: null });
    const response = await transactionService.getTransactions(filters);
    set({
      transactions: response.data,
      meta: response.meta,
      filters,
      isLoading: false,
    });
  },

  createTransaction: async (payload: CreateTransactionPayload) => {
    set({ isMutating: true, error: null });
    const transaction = await transactionService.createTransaction(payload);
    set(state => ({
      transactions: [transaction, ...state.transactions],
      isMutating: false,
    }));
  },

  updateTransaction: async (id: number, payload: UpdateTransactionPayload) => {
    set({ isMutating: true, error: null });
    const updated = await transactionService.updateTransaction(id, payload);
    set(state => ({
      transactions: state.transactions.map(t => (t.id === id ? updated : t)),
      isMutating: false,
    }));
  },

  deleteTransaction: async (id: number) => {
    set({ isMutating: true, error: null });
    await transactionService.deleteTransaction(id);
    set(state => ({
      transactions: state.transactions.filter(t => t.id !== id),
      isMutating: false,
    }));
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },

  reset: () => set(TRANSACTION_INITIAL_STATE),
}));
