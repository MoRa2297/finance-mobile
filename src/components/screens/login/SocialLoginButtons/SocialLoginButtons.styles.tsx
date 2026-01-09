import { StyleSheet } from 'react-native';
import { theme } from '@/config/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  divider: {
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: theme.colors.transparent,
  },
  socialButton: {
    flex: 1,
    height: 55,
    backgroundColor: theme.colors.primaryBK,
    borderColor: theme.colors.textHint,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
