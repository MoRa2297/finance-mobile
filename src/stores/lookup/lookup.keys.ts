export const lookupKeys = {
  all: ['lookup'] as const,
  colors: () => [...lookupKeys.all, 'colors'] as const,
  categoryIcons: () => [...lookupKeys.all, 'categoryIcons'] as const,
  bankTypes: () => [...lookupKeys.all, 'bankTypes'] as const,
  bankAccountTypes: () => [...lookupKeys.all, 'bankAccountTypes'] as const,
  cardTypes: () => [...lookupKeys.all, 'cardTypes'] as const,
};
