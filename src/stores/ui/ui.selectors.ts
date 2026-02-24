import { UIStore } from '@stores/ui/ui.types';

export const uiSelectors = {
  language: (state: UIStore) => state.language,
  theme: (state: UIStore) => state.theme,
  isLoading: (state: UIStore) => state.isLoading,
  isConnected: (state: UIStore) => state.isConnected,
  isLoggedIn: (state: UIStore) => state.isLoggedIn,
  isLoggingIn: (state: UIStore) => state.isLoggingIn,
  selectedBottomTab: (state: UIStore) => state.selectedBottomTab,
  bottomTabHeight: (state: UIStore) => state.bottomTabHeight,
  moneyIsVisible: (state: UIStore) => state.moneyIsVisible,
  prevScreen: (state: UIStore) => state.prevScreen,
};
