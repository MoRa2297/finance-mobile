export const recurringKeys = {
  all: ['recurring'] as const,
  lists: () => [...recurringKeys.all, 'list'] as const,
  detail: (id: number) => [...recurringKeys.all, 'detail', id] as const,
  mutations: {
    update: () => [...recurringKeys.all, 'update'] as const,
  },
};
