import { UIState } from './ui.types';

export const DEFAULT_LANG = 'it' as const;

export const UI_STORAGE_KEY = 'ui-storage';

export const INITIAL_UI_STATE: UIState = {
    language: DEFAULT_LANG,
    theme: 'light',
    bottomTabHeight: 0,
    isLoading: false,
    isConnected: true,
    isLoggedIn: false,
    isLoggingIn: false,
    isSigningUp: false,
    isSignedUp: false,
    signUpError: false,
    selectedBottomTab: 0,
    prevScreen: '',
    moneyIsVisible: true,
};
