import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

export const setupReactQueryFocus = () => {
  AppState.addEventListener('change', status => {
    focusManager.setFocused(status === 'active');
  });
};
