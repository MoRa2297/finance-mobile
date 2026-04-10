export const cardKeys = {
  all: ['cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  listByAccounts: (bankAccountIds: number[]) =>
    [...cardKeys.lists(), { bankAccountIds }] as const,
  detail: (id: number) => [...cardKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...cardKeys.all, 'create'] as const,
    update: () => [...cardKeys.all, 'update'] as const,
    delete: () => [...cardKeys.all, 'delete'] as const,
  },
};
