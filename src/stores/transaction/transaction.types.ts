import { Transaction, EditTransaction } from '@/types';
import { TransactionFilters, PaginatedTransactions } from '@/services';

export interface TransactionState {
  transactions: Transaction[];
  meta: PaginatedTransactions['meta'] | null;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;

  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  createTransaction: (payload: EditTransaction) => Promise<void>;
  updateTransaction: (id: number, payload: EditTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  reset: () => void;
}
