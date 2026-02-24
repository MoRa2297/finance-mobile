import { TransactionState } from './transaction.types';

export const transactionSelectors = {
  transactions: (state: TransactionState) => state.transactions,
  meta: (state: TransactionState) => state.meta,
  filters: (state: TransactionState) => state.filters,
  isLoading: (state: TransactionState) => state.isLoading,
  error: (state: TransactionState) => state.error,
  totalPages: (state: TransactionState) => state.meta?.totalPages ?? 0,
  currentPage: (state: TransactionState) => state.meta?.page ?? 1,
};
