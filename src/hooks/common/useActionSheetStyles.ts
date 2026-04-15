import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@config/theme';

export const useActionSheetStyles = () => {
  const insets = useSafeAreaInsets();

  return useMemo(
    () => ({
      containerStyle: {
        borderRadius: 20,
        backgroundColor: theme.colors.secondaryBK,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.colors.primaryBK,
        marginBottom: insets.bottom,
      },
      textStyle: {
        textAlign: 'center' as const,
        color: theme.colors.basic100,
      },
    }),
    [insets.bottom],
  );
};
