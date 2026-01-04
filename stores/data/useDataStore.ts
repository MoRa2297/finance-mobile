import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataStore } from './data.types';
import { INITIAL_DATA_STATE, DATA_STORAGE_KEY } from './data.constants';
import api from '../../services/api';

export const useDataStore = create<DataStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_DATA_STATE,

            // Setters
            setColors: (colors) => set({ colors }),
            setCategoryIcon: (categoryIcon) => set({ categoryIcon }),
            setCategories: (categories) => set({ categories }),
            setBankType: (bankTypes) => set({ bankTypes }),
            setBankAccountType: (bankAccountType) => set({ bankAccountType }),
            setBankAccount: (bankAccount) => set({ bankAccount }),
            setCardTypes: (cardTypes) => set({ cardTypes }),
            setBankCard: (bankCard) => set({ bankCard }),
            setTransaction: (transactions) => set({ transactions }),
            setHasBeenInitiated: (hasBeenInitiated) => set({ hasBeenInitiated }),

            // Init
            init: async (sessionToken, userId) => {
                try {
                    const { getColors, getCategoryIcons, getBankTypes, getBankAccountTypes, getCardTypes, getCategories, getBankAccounts, getBankCard } = get();

                    const dataDownloadResponse = await Promise.allSettled([
                        getColors(sessionToken),
                        getCategoryIcons(sessionToken),
                        getBankTypes(sessionToken),
                        getBankAccountTypes(sessionToken),
                        getCardTypes(sessionToken),
                        getCategories(sessionToken, String(userId)),
                        getBankAccounts(sessionToken, String(userId)),
                        getBankCard(sessionToken, String(userId)),
                    ]);

                    if (dataDownloadResponse.some((res) => res.status === 'rejected')) {
                        throw new Error('Failed to initialize data');
                    }
                } catch (error) {
                    console.log('ERROR: ', error);
                    throw error;
                } finally {
                    set({ hasBeenInitiated: true });
                }
            },

            // Colors
            getColors: async (sessionToken) => {
                try {
                    const response = await api.getColors(sessionToken);
                    set({ colors: response.colors });
                } catch (error) {
                    throw error;
                }
            },

            // Category Icons
            getCategoryIcons: async (sessionToken) => {
                try {
                    const response = await api.getCategoryIcons(sessionToken);
                    set({ categoryIcon: response.categoryIcons });
                } catch (error) {
                    throw error;
                }
            },

            // Bank Types
            getBankTypes: async (sessionToken) => {
                try {
                    const response = await api.getBankTypes(sessionToken);
                    set({ bankTypes: response.bankTypes });
                } catch (error) {
                    throw error;
                }
            },

            getBankAccountTypes: async (sessionToken) => {
                try {
                    const response = await api.getBankAccountTypes(sessionToken);
                    set({ bankAccountType: response.bankAccountTypes });
                } catch (error) {
                    throw error;
                }
            },

            getCardTypes: async (sessionToken) => {
                try {
                    const response = await api.getCardTypes(sessionToken);
                    set({ cardTypes: response.cardTypes });
                } catch (error) {
                    throw error;
                }
            },

            // Categories
            getCategories: async (sessionToken, userId) => {
                try {
                    const response = await api.getCategories(sessionToken, userId);
                    set({ categories: response.categories });
                } catch (error) {
                    throw error;
                }
            },

            createCategory: async (sessionToken, category) => {
                try {
                    const response = await api.createCategory(sessionToken, category);
                    const currentCategories = get().categories;
                    set({ categories: [...currentCategories, response.category] });
                } catch (error) {
                    throw error;
                }
            },

            updateCategory: async (sessionToken, category) => {
                try {
                    const response = await api.updateCategory(sessionToken, category);
                    const currentCategories = get().categories;
                    const newCategories = currentCategories.map((item) =>
                        item.id === response.category.id ? response.category : item
                    );
                    set({ categories: newCategories });
                } catch (error) {
                    throw error;
                }
            },

            deleteCategory: async (sessionToken, categoryId) => {
                try {
                    await api.deleteCategory(sessionToken, categoryId);
                    const currentCategories = get().categories;
                    const newCategories = currentCategories.filter(
                        (item) => item.id !== parseInt(categoryId)
                    );
                    set({ categories: newCategories });
                } catch (error) {
                    throw error;
                }
            },

            // Bank Accounts
            getBankAccounts: async (sessionToken, userId) => {
                try {
                    const response = await api.getBankAccounts(sessionToken, userId);
                    set({ bankAccount: response.bankAccounts });
                } catch (error) {
                    throw error;
                }
            },

            createBankAccount: async (sessionToken, bankAccount) => {
                try {
                    const response = await api.createBankAccount(sessionToken, bankAccount);
                    const currentBankAccounts = get().bankAccount;
                    set({ bankAccount: [...currentBankAccounts, response.bankAccount] });
                } catch (error) {
                    throw error;
                }
            },

            updateBankAccount: async (sessionToken, bankAccount) => {
                try {
                    const response = await api.updateBankAccount(sessionToken, bankAccount);
                    const currentBankAccounts = get().bankAccount;
                    const newBankAccounts = currentBankAccounts.map((item) =>
                        item.id === response.bankAccount.id ? response.bankAccount : item
                    );
                    set({ bankAccount: newBankAccounts });
                } catch (error) {
                    throw error;
                }
            },

            deleteBankAccount: async (sessionToken, bankAccountId) => {
                try {
                    await api.deleteBankAccount(sessionToken, bankAccountId);
                    const currentBankAccounts = get().bankAccount;
                    const newBankAccounts = currentBankAccounts.filter(
                        (item) => item.id !== parseInt(bankAccountId)
                    );
                    set({ bankAccount: newBankAccounts });
                } catch (error) {
                    throw error;
                }
            },

            // Bank Cards
            getBankCard: async (sessionToken, userId) => {
                try {
                    const response = await api.getBankCard(sessionToken, userId);
                    set({ bankCard: response.cardAccounts });
                } catch (error) {
                    throw error;
                }
            },

            createBankCard: async (sessionToken, bankCard) => {
                try {
                    const response = await api.createBankCard(sessionToken, bankCard);
                    const currentBankCards = get().bankCard;
                    set({ bankCard: [...currentBankCards, response.cardAccount] });
                } catch (error) {
                    throw error;
                }
            },

            updateBankCard: async (sessionToken, bankCard) => {
                try {
                    const response = await api.updateBankCard(sessionToken, bankCard);
                    const currentBankCards = get().bankCard;
                    const newBankCards = currentBankCards.map((item) =>
                        item.id === response.cardAccount.id ? response.cardAccount : item
                    );
                    set({ bankCard: newBankCards });
                } catch (error) {
                    throw error;
                }
            },

            deleteBankCard: async (sessionToken, bankCardId) => {
                try {
                    await api.deleteBankCard(sessionToken, bankCardId);
                    const currentBankCards = get().bankCard;
                    const newBankCards = currentBankCards.filter(
                        (item) => item.id !== parseInt(bankCardId)
                    );
                    set({ bankCard: newBankCards });
                } catch (error) {
                    throw error;
                }
            },

            // Transactions
            getTransactions: async (sessionToken, userId) => {
                try {
                    const response = await api.getTransactions(sessionToken, userId);
                    set({ transactions: response.transactions });
                } catch (error) {
                    throw error;
                }
            },

            createTransaction: async (sessionToken, transaction) => {
                try {
                    const response = await api.createTransaction(sessionToken, transaction);
                    const currentTransactions = get().transactions;
                    set({ transactions: [...currentTransactions, response.transaction] });
                } catch (error) {
                    throw error;
                }
            },

            updateTransaction: async (sessionToken, transaction) => {
                try {
                    const response = await api.updateTransaction(sessionToken, transaction);
                    const currentTransactions = get().transactions;
                    const newTransactions = currentTransactions.map((item) =>
                        item.id === response.transaction.id ? response.transaction : item
                    );
                    set({ transactions: newTransactions });
                } catch (error) {
                    throw error;
                }
            },

            deleteTransaction: async (sessionToken, transactionId) => {
                try {
                    await api.deleteTransaction(sessionToken, transactionId);
                    const currentTransactions = get().transactions;
                    const newTransactions = currentTransactions.filter(
                        (item) => item.id !== parseInt(transactionId)
                    );
                    set({ transactions: newTransactions });
                } catch (error) {
                    throw error;
                }
            },

            // Reset
            reset: () => set(INITIAL_DATA_STATE),
        }),
        {
            name: DATA_STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                categories: state.categories,
                bankAccount: state.bankAccount,
                bankCard: state.bankCard,
            }),
        }
    )
);
