import { create } from 'zustand';

import { DataStore } from './data.types';
import {
  INITIAL_DATA_STATE,
  MOCK_DATA_STATE,
  EMPTY_DATA_STATE,
} from './data.constants';

export const useDataStore = create<DataStore>(set => ({
  ...INITIAL_DATA_STATE,

  // Transactions
  setTransactions: transactions => set({ transactions }),

  addTransaction: transaction =>
    set(state => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: transaction =>
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === transaction.id ? transaction : t,
      ),
    })),

  deleteTransaction: id =>
    set(state => ({
      transactions: state.transactions.filter(t => t.id !== id),
    })),

  // Categories
  setCategories: categories => set({ categories }),

  addCategory: category =>
    set(state => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, data) =>
    set(state => ({
      categories: state.categories.map(c =>
        c.id === id ? { ...c, ...data } : c,
      ),
    })),

  deleteCategory: id =>
    set(state => ({
      categories: state.categories.filter(c => c.id !== id),
    })),

  // Bank Accounts
  setBankAccounts: bankAccounts => set({ bankAccounts }),
  addBankAccount: bankAccount =>
    set(state => ({
      bankAccounts: [...state.bankAccounts, bankAccount],
    })),
  updateBankAccount: (id, data) =>
    set(state => ({
      bankAccounts: state.bankAccounts.map(b =>
        b.id === id ? { ...b, ...data } : b,
      ),
    })),
  deleteBankAccount: id =>
    set(state => ({
      bankAccounts: state.bankAccounts.filter(b => b.id !== id),
    })),

  // Bank Types
  setBankTypes: bankTypes => set({ bankTypes }),
  setBankAccountTypes: bankAccountTypes => set({ bankAccountTypes }),

  // Bank Cards
  setBankCards: bankCards => set({ bankCards }),
  addBankCard: bankCard =>
    set(state => ({
      bankCards: [...state.bankCards, bankCard],
    })),
  updateBankCard: (id, data) =>
    set(state => ({
      bankCards: state.bankCards.map(c =>
        c.id === id ? { ...c, ...data } : c,
      ),
    })),
  deleteBankCard: id =>
    set(state => ({
      bankCards: state.bankCards.filter(c => c.id !== id),
    })),

  // Card Types
  setCardTypes: cardTypes => set({ cardTypes }),

  // UI State
  setIsLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),

  // Mock - Carica dati di test
  loadMockData: () => set(MOCK_DATA_STATE),

  // Clear - Pulisce tutti i dati
  clearData: () => set(EMPTY_DATA_STATE),

  // Reset
  reset: () => set(INITIAL_DATA_STATE),
}));
