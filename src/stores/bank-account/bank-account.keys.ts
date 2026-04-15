export const bankAccountKeys = {
  all: ['bank-accounts'] as const,
  lists: () => [...bankAccountKeys.all, 'list'] as const,
  detail: (id: number) => [...bankAccountKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...bankAccountKeys.all, 'create'] as const,
    update: () => [...bankAccountKeys.all, 'update'] as const,
    delete: () => [...bankAccountKeys.all, 'delete'] as const,
  },
};
