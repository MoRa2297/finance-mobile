import { TransactionFilters } from '@/types';

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  detail: (id: number) => [...transactionKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...transactionKeys.all, 'create'] as const,
    createTransfer: () => [...transactionKeys.all, 'create-transfer'] as const,
    update: () => [...transactionKeys.all, 'update'] as const,
    delete: () => [...transactionKeys.all, 'delete'] as const,
    updateTransfer: () => [...transactionKeys.all, 'update-transfer'] as const,
    deleteTransfer: () => [...transactionKeys.all, 'delete-transfer'] as const,
  },
};
