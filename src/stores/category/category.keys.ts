import { TransactionFormTypes } from '@/types';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  listByType: (type?: TransactionFormTypes) =>
    [...categoryKeys.lists(), { type }] as const,
  detail: (id: number) => [...categoryKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...categoryKeys.all, 'create'] as const,
    update: () => [...categoryKeys.all, 'update'] as const,
    delete: () => [...categoryKeys.all, 'delete'] as const,
  },
};
