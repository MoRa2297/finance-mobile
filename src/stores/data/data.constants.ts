import { DataState } from '@/stores';

export const DATA_STORAGE_KEY = 'data-storage';

export const INITIAL_DATA_STATE: DataState = {
  hasBeenInitiated: false,
  colors: [],
  categoryIcon: [],
  categories: [],
  bankTypes: [],
  bankAccountType: [],
  bankAccounts: [],
  cardTypes: [],
  transactions: [],
  bankCards: [],
};
