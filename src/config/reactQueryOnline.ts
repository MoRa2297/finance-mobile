import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export const setupReactQueryOnline = () => {
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected);
    });
  });
};
