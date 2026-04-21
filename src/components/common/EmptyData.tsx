import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { ButtonAppearance } from '@/components/ui/Button';

/**
 * - 'inline': fits inside a FlatList's ListEmptyComponent or a section.
 *             No forced flex; sits naturally in the layout flow.
 * - 'centered': fills the available vertical space and centers content.
 *               Use for tab screens or empty list containers with flex:1 parent.
 * - 'fullscreen': absolute fill, for blocking states (offline, fatal error).
 */
export type EmptyDataVariant = 'inline' | 'centered' | 'fullscreen';

export interface EmptyDataAction {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  /** Button appearance. Default: 'filled' (no shadow). */
  appearance?: ButtonAppearance;
}

export interface EmptyDataProps {
  title: string;
  subtitle?: string;
  /** Eva icon name (same source as UI Kitten icons). */
  iconName?: string;
  /** Icon size in px. Default: 56 */
  iconSize?: number;
  /** Icon color. Default: theme.colors.textHint */
  iconColor?: string;
  /** Layout variant. Default: 'centered' */
  variant?: EmptyDataVariant;
  /** Optional call-to-action button. */
  action?: EmptyDataAction;
  style?: StyleProp<ViewStyle>;
  /** Accessibility label override. Defaults to `${title}. ${subtitle}`. */
  accessibilityLabel?: string;
}

const EMPTY_DATA_MAX_WIDTH = '75%';

export const EmptyData: React.FC<EmptyDataProps> = ({
  title,
  subtitle,
  iconName,
  iconSize = 56,
  iconColor = theme.colors.textHint,
  variant = 'centered',
  action,
  style,
  accessibilityLabel,
}) => {
  const variantStyle =
    variant === 'inline'
      ? styles.inline
      : variant === 'fullscreen'
        ? styles.fullscreen
        : styles.centered;

  const a11yLabel =
    accessibilityLabel ?? (subtitle ? `${title}. ${subtitle}` : title);

  return (
    <View
      style={[styles.container, variantStyle, style]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={a11yLabel}>
      {iconName && (
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={iconSize} color={iconColor} />
        </View>
      )}

      <Text category="h6" style={styles.title}>
        {title}
      </Text>

      {subtitle && (
        <Text category="p2" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}

      {action && (
        <View style={styles.actionWrapper}>
          <Button
            size="small"
            buttonText={action.label}
            onPress={action.onPress}
            isLoading={action.isLoading}
            appearance={action.appearance ?? 'filled'}
            elevated={false}
            textStyle={styles.actionText}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  inline: {
    paddingVertical: 32,
  },
  centered: {
    flex: 1,
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryBK,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  title: {
    maxWidth: EMPTY_DATA_MAX_WIDTH,
    textAlign: 'center',
    color: theme.colors.textHint,
  },
  subtitle: {
    maxWidth: EMPTY_DATA_MAX_WIDTH,
    textAlign: 'center',
    color: theme.colors.textHint,
  },
  actionWrapper: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  actionText: {
    flex: 1,
    textAlign: 'center',
  },
});
