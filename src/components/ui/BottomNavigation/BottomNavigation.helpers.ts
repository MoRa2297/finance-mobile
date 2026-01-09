import { router, usePathname } from 'expo-router';
import { ROUTES } from '@config/constants';

export type TabType = 'home' | 'expenses' | 'budget' | 'settings';
export type TransactionType = 'income' | 'expense' | 'card_spending';

export interface TabConfig {
  name: TabType;
  route: string;
  icon: string;
  labelKey: string;
}

export const TABS: TabConfig[] = [
  {
    name: 'home',
    route: ROUTES.HOME,
    icon: 'home-outline',
    labelKey: 'components.bottomNavigator.home',
  },
  {
    name: 'expenses',
    route: ROUTES.EXPENSES,
    icon: 'clipboard-outline',
    labelKey: 'components.bottomNavigator.transaction',
  },
  {
    name: 'budget',
    route: ROUTES.BUDGET,
    icon: 'flag-outline',
    labelKey: 'components.bottomNavigator.budgets',
  },
  {
    name: 'settings',
    route: ROUTES.SETTINGS,
    icon: 'more-horizontal-outline',
    labelKey: 'components.bottomNavigator.more',
  },
];

export const getSelectedIndex = (pathname: string): number => {
  if (pathname.includes('expenses')) return 1;
  if (pathname.includes('budget')) return 3;
  if (pathname.includes('settings')) return 4;
  return 0;
};

export const navigateToTab = (index: number): void => {
  const tabRoutes = [
    ROUTES.HOME,
    ROUTES.EXPENSES,
    null,
    ROUTES.BUDGET,
    ROUTES.SETTINGS,
  ];
  const route = tabRoutes[index];

  if (route) {
    router.navigate(route);
  }
};

export const navigateToTransaction = (type: TransactionType): void => {
  router.push({
    pathname: ROUTES.TRANSACTION,
    params: { formType: type, transaction: null },
  });
};
