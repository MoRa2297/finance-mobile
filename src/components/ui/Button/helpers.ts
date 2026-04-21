import { Platform, ViewStyle } from 'react-native';

import { theme } from '@config/theme';

import { ButtonAppearance, ButtonStatus, VariantColors } from './types';

/**
 * Maps a semantic status to its base theme color.
 * Falls back to primary if the status color isn't defined in the theme.
 */
export const getStatusColor = (status: ButtonStatus): string => {
  const map: Record<ButtonStatus, string> = {
    primary: theme.colors.primary,
    danger: theme.colors.danger500 ?? theme.colors.primary,
    success: theme.colors.green ?? theme.colors.primary,
    warning: theme.colors.orange ?? theme.colors.primary,
    neutral: theme.colors.textHint,
  };
  return map[status];
};

/**
 * Resolves button colors based on appearance + status.
 * Appearance controls how the status color is applied (filled/outline/ghost).
 */
export const getVariantStyle = (
  appearance: ButtonAppearance,
  status: ButtonStatus,
): VariantColors => {
  const statusColor = getStatusColor(status);

  switch (appearance) {
    case 'filled':
      return {
        bg: statusColor,
        text: theme.colors.basic100,
        border: statusColor,
        borderWidth: 0,
      };
    case 'outline':
      return {
        bg: theme.colors.transparent,
        text: statusColor,
        border: statusColor,
        borderWidth: 2,
      };
    case 'ghost':
      return {
        bg: theme.colors.transparent,
        text: statusColor,
        border: theme.colors.transparent,
        borderWidth: 0,
      };
  }
};

/**
 * Platform-specific elevation/shadow factory.
 * iOS uses shadow props; Android uses elevation.
 */
export const getShadowStyle = (color: string): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  });
