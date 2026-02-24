import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lookupService } from '@/services';
import { LookupState } from './lookup.types';
import { LOOKUP_INITIAL_STATE, LOOKUP_STORAGE_KEY } from './lookup.constants';

export const useLookupStore = create<LookupState>()(
  persist(
    set => ({
      ...LOOKUP_INITIAL_STATE,

      fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
          const [
            colors,
            categoryIcons,
            bankTypes,
            bankAccountTypes,
            cardTypes,
          ] = await Promise.all([
            lookupService.getColors(),
            lookupService.getCategoryIcons(),
            lookupService.getBankTypes(),
            lookupService.getBankAccountTypes(),
            lookupService.getCardTypes(),
          ]);

          console.log('colors: ', colors);
          console.log('categoryIcons: ', categoryIcons);
          console.log('bankTypes: ', bankTypes);
          console.log('bankAccountTypes: ', bankAccountTypes);
          console.log('cardTypes: ', cardTypes);

          set({
            colors,
            categoryIcons,
            bankTypes,
            bankAccountTypes,
            cardTypes,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load lookup data';
          set({ isLoading: false, error: message });
        }
      },

      reset: () => set(LOOKUP_INITIAL_STATE),
    }),
    {
      name: LOOKUP_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        colors: state.colors,
        categoryIcons: state.categoryIcons,
        bankTypes: state.bankTypes,
        bankAccountTypes: state.bankAccountTypes,
        cardTypes: state.cardTypes,
      }),
    },
  ),
);
