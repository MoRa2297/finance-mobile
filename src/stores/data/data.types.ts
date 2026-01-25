import {
  Transaction,
  Category,
  BankAccount,
  BankCard,
  BankType,
  BankAccountType,
  CardType,
} from '@/types';

export interface DataState {
  transactions: Transaction[];
  categories: Category[];
  bankAccounts: BankAccount[];
  bankCards: BankCard[];
  bankTypes: BankType[];
  bankAccountTypes: BankAccountType[];
  cardTypes: CardType[];
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

  // Bank Accounts
  setBankAccounts: (bankAccounts: BankAccount[]) => void;
  addBankAccount: (bankAccount: BankAccount) => void;
  updateBankAccount: (id: number, data: Partial<BankAccount>) => void;
  deleteBankAccount: (id: number) => void;

  // Bank Types
  setBankTypes: (bankTypes: BankType[]) => void;
  setBankAccountTypes: (bankAccountTypes: BankAccountType[]) => void;

  // Bank Cards
  setBankCards: (bankCards: BankCard[]) => void;
  addBankCard: (bankCard: BankCard) => void;
  updateBankCard: (id: number, data: Partial<BankCard>) => void;
  deleteBankCard: (id: number) => void;

  // Card Types
  setCardTypes: (cardTypes: CardType[]) => void;

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
