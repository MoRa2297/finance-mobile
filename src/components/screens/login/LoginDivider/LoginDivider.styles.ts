import { StyleSheet } from 'react-native';
import { theme } from '@/config/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 16,
    color: theme.colors.textHint,
    fontWeight: '300',
  },
});
