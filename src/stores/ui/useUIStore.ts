import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { UIStore } from '@/stores';
import { INITIAL_UI_STATE, UI_STORAGE_KEY } from '@/stores';
import { i18n } from '@/i18n';

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_UI_STATE,

      setLanguage: lang => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },

      setTheme: theme => set({ theme }),

      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },

      setIsLoading: isLoading => set({ isLoading }),

      setIsLoggedIn: isLoggedIn => set({ isLoggedIn }),

      setIsConnected: isConnected => set({ isConnected }),

      setSelectedBottomTab: tab => set({ selectedBottomTab: tab }),

      setBottomTabHeight: height => set({ bottomTabHeight: height }),

      setMoneyIsVisible: () => {
        const current = get().moneyIsVisible;
        set({ moneyIsVisible: !current });
      },

      // Alias for consistency
      toggleMoneyVisibility: () => {
        const current = get().moneyIsVisible;
        set({ moneyIsVisible: !current });
      },

      setIsLoggingIn: isLoggingIn => set({ isLoggingIn }),

      setIsSigningUp: isSigningUp => set({ isSigningUp }),

      setIsSignedUp: isSignedUp => set({ isSignedUp }),

      setSignUpError: error => set({ signUpError: error }),

      setPrevScreen: screen => set({ prevScreen: screen }),

      init: async () => {
        set({ isLoading: true });
        try {
          const state = await NetInfo.fetch();
          set({ isConnected: state.isConnected ?? false });
        } catch (err) {
          console.warn('init session failed:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set(INITIAL_UI_STATE),
    }),
    {
      name: UI_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        language: state.language,
        theme: state.theme,
        moneyIsVisible: state.moneyIsVisible,
      }),
    },
  ),
);
