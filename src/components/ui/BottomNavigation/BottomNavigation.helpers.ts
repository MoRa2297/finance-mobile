import { router } from 'expo-router';
import { ROUTES } from '@config/constants';

export type TransactionType = 'income' | 'expense' | 'card_spending';

export const getSelectedIndex = (pathname: string): number => {
  if (pathname.includes('expenses')) return 1;
  if (pathname.includes('budget')) return 3;
  if (pathname.includes('settings')) return 4;
  return 0;
};

export const navigateToTab = (index: number): void => {
  const routes = [
    ROUTES.HOME,
    ROUTES.EXPENSES,
    null, // FloatingButton (index 2)
    ROUTES.BUDGET,
    ROUTES.SETTINGS,
  ];

  const route = routes[index];
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
