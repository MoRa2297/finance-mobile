export type Theme = 'light' | 'dark';
export type I18NLang = 'it' | 'en';

export interface UIState {
    language: I18NLang;
    theme: Theme;
    bottomTabHeight: number;
    isLoading: boolean;
    isConnected: boolean;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isSignedUp: boolean;
    signUpError: boolean;
    selectedBottomTab: number;
    prevScreen: string;
    moneyIsVisible: boolean;
}

export interface UIActions {
    setLanguage: (lang: I18NLang) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setIsConnected: (isConnected: boolean) => void;
    setSelectedBottomTab: (tab: number) => void;
    setBottomTabHeight: (height: number) => void;
    setMoneyIsVisible: () => void;
    setIsLoggingIn: (isLoggingIn: boolean) => void;
    setIsSigningUp: (isSigningUp: boolean) => void;
    setIsSignedUp: (isSignedUp: boolean) => void;
    setSignUpError: (error: boolean) => void;
    setPrevScreen: (screen: string) => void;
    init: () => Promise<void>;
    reset: () => void;
}

export type UIStore = UIState & UIActions;
