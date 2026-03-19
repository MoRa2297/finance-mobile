import { TransactionState } from './transaction.types';

export const transactionSelectors = {
  transactions: (state: TransactionState) => state.transactions,
  meta: (state: TransactionState) => state.meta,
  filters: (state: TransactionState) => state.filters,
  isLoading: (state: TransactionState) => state.isLoading,
  isMutating: (state: TransactionState) => state.isMutating,
  error: (state: TransactionState) => state.error,
  // createTransfer: (payload: CreateTransferPayload) => Promise<void>;
};
