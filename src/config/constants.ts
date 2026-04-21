import { Dimensions } from 'react-native';
import { GenericType } from '@/types';

const screen = Dimensions.get('screen');

export const SCREEN_HEIGHT: number = screen.height;
export const HORIZONTAL_PADDING: number = 16;
export const BOTTOM_NAV_HEIGHT = 110;
export const GLOBAL_BORDER_RADIUS: number = 45;

export const MONTH_NUMBER: Array<GenericType> = Array.from(
  { length: 12 },
  (_, i) => ({ id: i + 1, name: String(i + 1) }),
);

export const DAYS_NUMBER: Array<GenericType> = Array.from(
  { length: 31 },
  (_, i) => ({ id: i + 1, name: String(i + 1) }),
);

const currentYear = new Date().getFullYear();

export const YEARS_NUMBER: Array<GenericType> = Array.from(
  { length: 15 },
  (_, i) => ({ id: i + 1, name: String(currentYear + i) }),
);

// TODO use these
export const ROUTES = {
  // Unauth
  LOGIN: '/(unauth)/login',
  REGISTER: '/(unauth)/register',

  // Auth - Tabs
  HOME: '/(auth)/(tabs)',
  EXPENSES: '/(auth)/(tabs)/expenses',
  BUDGET: '/(auth)/(tabs)/budget',
  SETTINGS: '/(auth)/(tabs)/settings',

  // Auth - Stack
  TRANSACTION: '/(auth)/transaction',
  PROFILE: '/(auth)/profile',
  CATEGORIES: '/(auth)/categories',
  CATEGORY_DETAIL: '/(auth)/categories/[id]',
  CATEGORY_FORM: '/(auth)/categories/form',
  BANK_ACCOUNTS: '/(auth)/bank-accounts',
  BANK_ACCOUNT_DETAIL: '/(auth)/bank-accounts/[id]',
  BANK_ACCOUNT_FORM: '/(auth)/bank-accounts/form',
  BANK_CARDS: '/(auth)/bank-cards',
  BANK_CARD_DETAIL: '/(auth)/bank-cards/[id]',
  BANK_CARD_FORM: '/(auth)/bank-cards/form',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
