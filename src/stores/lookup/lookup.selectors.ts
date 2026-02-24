import { LookupState } from './lookup.types';

export const lookupSelectors = {
  colors: (state: LookupState) => state.colors,
  categoryIcons: (state: LookupState) => state.categoryIcons,
  bankTypes: (state: LookupState) => state.bankTypes,
  bankAccountTypes: (state: LookupState) => state.bankAccountTypes,
  cardTypes: (state: LookupState) => state.cardTypes,
  isLoading: (state: LookupState) => state.isLoading,
  error: (state: LookupState) => state.error,
};
