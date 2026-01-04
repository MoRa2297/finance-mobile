import { UIStore } from './ui.types';

export const selectLanguage = (state: UIStore) => state.language;
export const selectTheme = (state: UIStore) => state.theme;
export const selectIsLoading = (state: UIStore) => state.isLoading;
export const selectIsConnected = (state: UIStore) => state.isConnected;
export const selectIsLoggedIn = (state: UIStore) => state.isLoggedIn;
export const selectIsLoggingIn = (state: UIStore) => state.isLoggingIn;
export const selectSelectedBottomTab = (state: UIStore) => state.selectedBottomTab;
export const selectBottomTabHeight = (state: UIStore) => state.bottomTabHeight;
export const selectMoneyIsVisible = (state: UIStore) => state.moneyIsVisible;
export const selectPrevScreen = (state: UIStore) => state.prevScreen;
