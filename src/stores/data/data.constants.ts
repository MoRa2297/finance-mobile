import {
  MOCK_TRANSACTIONS,
  MOCK_CATEGORIES,
  MOCK_BANK_ACCOUNTS,
  MOCK_BANK_CARDS,
} from '@/mocks';

export const DATA_STORAGE_KEY = 'data-storage';

// Flag per abilitare/disabilitare i mock
export const USE_MOCK_DATA = true;

export const EMPTY_DATA_STATE = {
  transactions: [],
  categories: [],
  bankAccounts: [],
  bankCards: [],
  isLoading: false,
  error: null,
};

export const MOCK_DATA_STATE = {
  transactions: MOCK_TRANSACTIONS,
  categories: MOCK_CATEGORIES,
  bankAccounts: MOCK_BANK_ACCOUNTS,
  bankCards: MOCK_BANK_CARDS,
  isLoading: false,
  error: null,
};

export const INITIAL_DATA_STATE = USE_MOCK_DATA
  ? MOCK_DATA_STATE
  : EMPTY_DATA_STATE;
