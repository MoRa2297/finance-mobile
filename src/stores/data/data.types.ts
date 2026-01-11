import { Transaction, Category, BankAccount, BankCard } from '@/types/types';

export interface DataState {
  transactions: Transaction[];
  categories: Category[];
  bankAccounts: BankAccount[];
  bankCards: BankCard[];
  isLoading: boolean;
  error: string | null;
}

export interface DataActions {
  // Transactions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;

  // Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: number, data: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Bank
  setBankAccounts: (bankAccounts: BankAccount[]) => void;
  setBankCards: (bankCards: BankCard[]) => void;

  // UI State
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Mock
  loadMockData: () => void;
  clearData: () => void;

  // Reset
  reset: () => void;
}

export type DataStore = DataState & DataActions;
