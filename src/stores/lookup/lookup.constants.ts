import { LookupState } from './lookup.types';

export const LOOKUP_STORAGE_KEY = 'finance-lookup-storage';

export const LOOKUP_INITIAL_STATE: Pick<
  LookupState,
  | 'colors'
  | 'categoryIcons'
  | 'bankTypes'
  | 'bankAccountTypes'
  | 'cardTypes'
  | 'isLoading'
  | 'error'
> = {
  colors: [],
  categoryIcons: [],
  bankTypes: [],
  bankAccountTypes: [],
  cardTypes: [],
  isLoading: false,
  error: null,
};
