import { DataStore } from './data.types';

export const selectHasBeenInitiated = (state: DataStore) => state.hasBeenInitiated;
export const selectColors = (state: DataStore) => state.colors;
export const selectCategoryIcon = (state: DataStore) => state.categoryIcon;
export const selectCategories = (state: DataStore) => state.categories;
export const selectBankTypes = (state: DataStore) => state.bankTypes;
export const selectBankAccountType = (state: DataStore) => state.bankAccountType;
export const selectBankAccount = (state: DataStore) => state.bankAccount;
export const selectCardTypes = (state: DataStore) => state.cardTypes;
export const selectBankCard = (state: DataStore) => state.bankCard;
export const selectTransactions = (state: DataStore) => state.transactions;

// Derived selectors
export const selectIncomeCategories = (state: DataStore) =>
    state.categories.filter((cat) => cat.type === 'income');

export const selectExpenseCategories = (state: DataStore) =>
    state.categories.filter((cat) => cat.type === 'expenses');
