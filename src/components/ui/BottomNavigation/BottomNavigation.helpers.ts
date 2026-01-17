import { router } from 'expo-router';

import { ROUTES } from '@/config/constants';

export type TransactionType = 'income' | 'expense' | 'card_spending';

const TAB_ROUTES = [
  ROUTES.HOME,
  ROUTES.EXPENSES,
  null, // FloatingButton (index 2)
  ROUTES.BUDGET,
  ROUTES.SETTINGS,
] as const;

export const getSelectedIndex = (pathname: string): number => {
  // Normalize: remove (auth)/(tabs) to have easier match
  const normalized = pathname
    .replace('/(auth)/(tabs)', '')
    .replace('/(auth)', '');

  if (normalized === '' || normalized === '/') return 0; // Home
  if (normalized.includes('expenses')) return 1;
  if (normalized.includes('budget')) return 3;
  if (normalized.includes('settings')) return 4;

  return -1; // No tab selected
};

export const navigateToTab = (index: number): void => {
  const route = TAB_ROUTES[index];
  if (route) {
    router.navigate(route);
  }
};

export const navigateToTransaction = (type: TransactionType): void => {
  router.push({
    pathname: ROUTES.TRANSACTION,
    params: { formType: type },
  });
};
