import { Dimensions } from 'react-native';
import { BankAccountType, CardType, GenericType } from '@/types';
import { I18NLang } from '@/i18n';

// TODO CLEAN

const screen = Dimensions.get('screen');

export const DEFAULT_LANG: I18NLang = 'it';

export const SCREEN_WIDTH: number = screen.width;

export const SCREEN_HEIGHT: number = screen.height;

export const HORIZONTAL_PADDING: number = 16;

export const BOTTOM_NAV_HEIGHT = 110;

export const MONTH = [
  {
    row: 0,
    name: 'january',
  },
  {
    row: 1,
    name: 'february',
  },
  {
    row: 2,
    name: 'march',
  },
  {
    row: 3,
    name: 'april',
  },
  {
    row: 4,
    name: 'may',
  },
  {
    row: 5,
    name: 'june',
  },
  {
    row: 6,
    name: 'july',
  },
  {
    row: 7,
    name: 'august',
  },
  {
    row: 8,
    name: 'september',
  },
  {
    row: 9,
    name: 'october',
  },
  {
    row: 10,
    name: 'november',
  },
  {
    row: 11,
    name: 'december',
  },
];

export const GLOBAL_BORDER_RADIUS: number = 45;

export const CATEGORY_COLORS: Array<{ value: string }> = [
  {
    value: '#5d4c86',
  },
  {
    value: '#946aa2',
  },
  {
    value: '#c3a5b4',
  },
  {
    value: '#edeff3',
  },
  {
    value: '#d30b94',
  },
  {
    value: '#f07cab',
  },
  {
    value: '#772b9d',
  },
  {
    value: '#b732cc',
  },
  {
    value: '#2f2aa0',
  },
  {
    value: '#f47a22',
  },
  {
    value: '#ffc413',
  },
  {
    value: '#632819',
  },
  {
    value: '#96341c',
  },
  {
    value: '#c56133',
  },
  {
    value: '#e68f66',
  },
  {
    value: '#ffcba5',
  },
  {
    value: '#991919',
  },
  {
    value: '#f22020',
  },
  {
    value: '#3750db',
  },
  {
    value: '#277da7',
  },
  {
    value: '#37294f',
  },
  {
    value: '#3998f5',
  },
  {
    value: '#29bdab',
  },
  {
    value: '#235b54',
  },
  {
    value: '#8ad8e8',
  },
  {
    value: '#228c68',
  },
  {
    value: '#0ec434',
  },
  {
    value: '#7dfc00',
  },
  {
    value: '#fcff5d',
  },
  {
    value: '#ffffff',
  },
  {
    value: '#000000',
  },
];

export const CATEGORY_ICONS: Array<{ value: string }> = [
  {
    value: 'plus-outline',
  },
  {
    value: 'wifi-outline',
  },
  {
    value: 'volume-mute-outline',
  },
  {
    value: 'video-off-outline',
  },
  {
    value: 'thermometer-plus-outline',
  },
];

export const BANK_ACCOUNT_TYPE: Array<BankAccountType> = [
  {
    id: 1,
    name: 'checking_account',
  },
  {
    id: 1,
    name: 'money',
  },
  {
    id: 1,
    name: 'savings',
  },
  {
    id: 1,
    name: 'investment',
  },
  {
    id: 1,
    name: 'other',
  },
];

export const CARD_TYPE: Array<CardType> = [
  {
    id: 1,
    name: 'Test 1',
    imageUrl: 'checking_account', // TODO check it was icon
  },
  {
    id: 2,
    name: 'Test 2',
    imageUrl: 'checking_account', // TODO check it was icon
  },
  {
    id: 3,
    name: 'Test 3',
    imageUrl: 'checking_account', // TODO check it was icon
  },
  {
    id: 4,
    name: 'Test 4',
    imageUrl: 'checking_account', // TODO check it was icon
  },
];

export const MONTH_NUMBER: Array<GenericType> = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
  {
    id: 8,
    name: '8',
  },
  {
    id: 9,
    name: '9',
  },
  {
    id: 10,
    name: '10',
  },
  {
    id: 11,
    name: '11',
  },
  {
    id: 12,
    name: '12',
  },
];

export const YEARS_NUMBER: Array<GenericType> = [
  {
    id: 1,
    name: '1950',
  },
  {
    id: 2,
    name: '1951',
  },
  {
    id: 3,
    name: '1952',
  },
  {
    id: 4,
    name: '1953',
  },
  {
    id: 5,
    name: '1954',
  },
  {
    id: 6,
    name: '1955',
  },
  {
    id: 7,
    name: '1956',
  },
  {
    id: 8,
    name: '1957',
  },
  {
    id: 9,
    name: '1958',
  },
  {
    id: 10,
    name: '1959',
  },
  {
    id: 11,
    name: '1960',
  },
  {
    id: 12,
    name: '1961',
  },
  {
    id: 13,
    name: '1962',
  },
  {
    id: 14,
    name: '1963',
  },
  {
    id: 15,
    name: '1964',
  },
  {
    id: 16,
    name: '1965',
  },
  {
    id: 17,
    name: '1966',
  },
  {
    id: 18,
    name: '1967',
  },
  {
    id: 19,
    name: '1968',
  },
  {
    id: 20,
    name: '1969',
  },
  {
    id: 21,
    name: '1970',
  },
  {
    id: 22,
    name: '1971',
  },
  {
    id: 23,
    name: '1972',
  },
  {
    id: 24,
    name: '1973',
  },
  {
    id: 25,
    name: '1974',
  },
  {
    id: 26,
    name: '1975',
  },
  {
    id: 27,
    name: '1976',
  },
  {
    id: 28,
    name: '1977',
  },
  {
    id: 29,
    name: '1978',
  },
  {
    id: 30,
    name: '1979',
  },
  {
    id: 31,
    name: '1980',
  },
  {
    id: 32,
    name: '1981',
  },
  {
    id: 33,
    name: '1982',
  },
  {
    id: 34,
    name: '1983',
  },
  {
    id: 35,
    name: '1984',
  },
  {
    id: 36,
    name: '1985',
  },
  {
    id: 37,
    name: '1986',
  },
  {
    id: 38,
    name: '1987',
  },
  {
    id: 39,
    name: '1988',
  },
  {
    id: 40,
    name: '1989',
  },
  {
    id: 41,
    name: '1990',
  },
  {
    id: 42,
    name: '1991',
  },
  {
    id: 43,
    name: '1992',
  },
  {
    id: 44,
    name: '1993',
  },
  {
    id: 45,
    name: '1994',
  },
  {
    id: 46,
    name: '1995',
  },
  {
    id: 47,
    name: '1996',
  },
  {
    id: 48,
    name: '1997',
  },
  {
    id: 49,
    name: '1998',
  },
  {
    id: 50,
    name: '1999',
  },
  {
    id: 51,
    name: '2000',
  },
  {
    id: 52,
    name: '2001',
  },
  {
    id: 53,
    name: '2002',
  },
  {
    id: 54,
    name: '2003',
  },
  {
    id: 55,
    name: '2004',
  },
  {
    id: 56,
    name: '2005',
  },
  {
    id: 57,
    name: '2006',
  },
  {
    id: 58,
    name: '2007',
  },
  {
    id: 59,
    name: '2008',
  },
  {
    id: 60,
    name: '2009',
  },
  {
    id: 61,
    name: '2010',
  },
  {
    id: 62,
    name: '2011',
  },
  {
    id: 63,
    name: '2012',
  },
  {
    id: 64,
    name: '2013',
  },
  {
    id: 65,
    name: '2014',
  },
  {
    id: 66,
    name: '2015',
  },
  {
    id: 67,
    name: '2016',
  },
  {
    id: 68,
    name: '2017',
  },
  {
    id: 69,
    name: '2018',
  },
  {
    id: 70,
    name: '2019',
  },
  {
    id: 71,
    name: '2020',
  },
  {
    id: 72,
    name: '2021',
  },
  {
    id: 73,
    name: '2022',
  },
  {
    id: 74,
    name: '2023',
  },
  {
    id: 75,
    name: '2024',
  },
  {
    id: 76,
    name: '2025',
  },
  {
    id: 77,
    name: '2026',
  },
  {
    id: 78,
    name: '2027',
  },
  {
    id: 79,
    name: '2028',
  },
  {
    id: 80,
    name: '2029',
  },
  {
    id: 81,
    name: '2030',
  },
  {
    id: 82,
    name: '2031',
  },
  {
    id: 83,
    name: '2032',
  },
  {
    id: 84,
    name: '2033',
  },
];

export const DAYS_NUMBER: Array<GenericType> = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
  {
    id: 8,
    name: '8',
  },
  {
    id: 9,
    name: '9',
  },
  {
    id: 10,
    name: '10',
  },
  {
    id: 11,
    name: '11',
  },
  {
    id: 12,
    name: '12',
  },
  {
    id: 13,
    name: '13',
  },
  {
    id: 14,
    name: '14',
  },
  {
    id: 15,
    name: '15',
  },
  {
    id: 16,
    name: '16',
  },
  {
    id: 17,
    name: '17',
  },
  {
    id: 18,
    name: '18',
  },
  {
    id: 19,
    name: '19',
  },
  {
    id: 20,
    name: '20',
  },
  {
    id: 21,
    name: '21',
  },
  {
    id: 22,
    name: '22',
  },
  {
    id: 23,
    name: '23',
  },
  {
    id: 24,
    name: '24',
  },
  {
    id: 25,
    name: '25',
  },
  {
    id: 26,
    name: '26',
  },
  {
    id: 27,
    name: '27',
  },
  {
    id: 28,
    name: '28',
  },
  {
    id: 29,
    name: '29',
  },
  {
    id: 30,
    name: '30',
  },
  {
    id: 31,
    name: '31',
  },
];

export const GENERAL_START_DATE = '2020-01-01';

export const GENERAL_END_DATE = '2030-01-01';

export const ROUTES = {
  // Unauth
  LOGIN: '/(unauth)/login',
  REGISTER: '/(unauth)/register',

  // Auth - Tabs
  HOME: '/(auth)/(tabs)',
  EXPENSES: '/(auth)/(tabs)/expenses',
  BUDGET: '/(auth)/(tabs)/budget',
  SETTINGS: '/(auth)/(tabs)/settings',

  // Auth - Stack (da Settings)
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
