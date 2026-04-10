import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionService } from '@/services';
import { TransactionFilters } from '@/types';
import { transactionKeys } from './transaction.keys';

export const useTransactions = (filters: TransactionFilters = {}) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: ({ signal }) =>
      transactionService.getTransactions(filters, signal),
    placeholderData: keepPreviousData,
    select: data => ({
      transactions: data.data,
      meta: data.meta,
    }),
  });
};

export const useTransaction = (id: number | null) => {
  return useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: ({ signal }) => transactionService.getTransaction(id!, signal),
    enabled: id !== null && id > 0,
  });
};
