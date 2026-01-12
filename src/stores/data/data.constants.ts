import {
  MOCK_TRANSACTIONS,
  MOCK_CATEGORIES,
  MOCK_BANK_ACCOUNTS,
  MOCK_BANK_CARDS,
  MOCK_CARD_TYPES,
} from '@/mocks';
import { MOCK_BANK_ACCOUNT_TYPES, MOCK_BANK_TYPES } from '@/mocks/bankAccounts';

export const DATA_STORAGE_KEY = 'data-storage';

export const USE_MOCK_DATA = true;

export const EMPTY_DATA_STATE = {
  transactions: [],
  categories: [],
  bankAccounts: [],
  bankCards: [],
  bankTypes: [],
  bankAccountTypes: [],
  cardTypes: [],
  isLoading: false,
  error: null,
};

export const MOCK_DATA_STATE = {
  transactions: MOCK_TRANSACTIONS,
  categories: MOCK_CATEGORIES,
  bankAccounts: MOCK_BANK_ACCOUNTS,
  bankCards: MOCK_BANK_CARDS,
  bankTypes: MOCK_BANK_TYPES,
  bankAccountTypes: MOCK_BANK_ACCOUNT_TYPES,
  cardTypes: MOCK_CARD_TYPES,
  isLoading: false,
  error: null,
};

export const INITIAL_DATA_STATE = USE_MOCK_DATA
  ? MOCK_DATA_STATE
  : EMPTY_DATA_STATE;
