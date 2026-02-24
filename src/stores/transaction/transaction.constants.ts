import { TransactionFilters } from '@/services';
import { TransactionState } from './transaction.types';

export const TRANSACTION_INITIAL_FILTERS: TransactionFilters = {
  page: 1,
  limit: 20,
};

export const TRANSACTION_INITIAL_STATE: Pick<
  TransactionState,
  'transactions' | 'meta' | 'filters' | 'isLoading' | 'error'
> = {
  transactions: [],
  meta: null,
  filters: TRANSACTION_INITIAL_FILTERS,
  isLoading: false,
  error: null,
};
