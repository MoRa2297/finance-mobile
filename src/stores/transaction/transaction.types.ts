import {
  Transaction,
  TransactionFilters,
  TransactionMeta,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from '@/types';

export interface TransactionState {
  transactions: Transaction[];
  meta: TransactionMeta | null;
  filters: TransactionFilters;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  createTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  updateTransaction: (
    id: number,
    payload: UpdateTransactionPayload,
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  reset: () => void;
}
