import {
  CreateTransactionPayload,
  CreateTransferPayload,
  UpdateTransactionPayload,
  TransactionFilters,
  TransactionMeta,
  Transaction,
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
  createTransfer: (payload: CreateTransferPayload) => Promise<void>;
  updateTransaction: (
    id: number,
    payload: UpdateTransactionPayload,
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  reset: () => void;
}
