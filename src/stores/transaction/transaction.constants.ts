import { TransactionFilters, TransactionMeta } from '@/types';

export const TRANSACTION_INITIAL_STATE = {
  transactions: [],
  meta: null as TransactionMeta | null,
  filters: {} as TransactionFilters,
  isLoading: false,
  isMutating: false,
  error: null,
};
