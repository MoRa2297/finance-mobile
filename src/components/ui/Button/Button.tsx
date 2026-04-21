import React, { useCallback, useMemo } from 'react';
import { Button as KittenButton, Text } from '@ui-kitten/components';
import {
  ImageProps,
  LayoutChangeEvent,
  StyleProp,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { RenderProp } from '@ui-kitten/components/devsupport';

import { theme } from '@config/theme';
import { LoadingSpinner } from '@components/common';

import { getShadowStyle, getVariantStyle } from './helpers';
import { usePressAnimation, useButtonHaptic } from './hooks';
import { buttonStyles as styles } from './styles';
import { ButtonAppearance, ButtonSize, ButtonStatus } from './types';

interface ButtonProps {
  adjustsFontSizeToFit?: boolean;
  buttonText?: string;
  appearance?: ButtonAppearance;
  /** Semantic color. Default: 'primary' */
  status?: ButtonStatus;
  isDisabled?: boolean;
  numberOfLines?: number;
  size?: ButtonSize;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode[];
  textStyle?: StyleProp<TextStyle>;
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  /** Enable haptic feedback on press. Default: false (opt-in). */
  hapticEnabled?: boolean;
  /** Enable shadow on filled appearance. Default: true */
  elevated?: boolean;
  /** Accessibility label. Falls back to buttonText if omitted. */
  accessibilityLabel?: string;
  /** Accessibility hint describing the action outcome. */
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  adjustsFontSizeToFit,
  buttonText,
  appearance = 'filled',
  status = 'primary',
  isDisabled = false,
  numberOfLines,
  size = 'medium',
  isLoading,
  style,
  children,
  textStyle,
  accessoryRight,
  onLayout,
  onPress,
  hapticEnabled = false,
  elevated = true,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isInteractionDisabled = isDisabled || isLoading;

  // Recomputed per render so future dynamic theming picks up changes.
  const variantStyle = useMemo(
    () => getVariantStyle(appearance, status),
    [appearance, status],
  );

  const { animatedStyle, overlayStyle, handlers } = usePressAnimation({
    withOverlay: appearance !== 'filled',
    disabled: isInteractionDisabled,
  });

  const triggerHaptic = useButtonHaptic({
    enabled: hapticEnabled,
    style: 'light',
  });

  const handlePress = useCallback(() => {
    if (isInteractionDisabled) return;
    triggerHaptic();
    onPress();
  }, [isInteractionDisabled, triggerHaptic, onPress]);

  const extraStyle: ViewStyle = {
    backgroundColor: variantStyle.bg,
    borderWidth: variantStyle.borderWidth,
    borderColor: variantStyle.border,
  };

  const shadowStyle =
    elevated && appearance === 'filled' && !isInteractionDisabled
      ? getShadowStyle(variantStyle.bg)
      : null;

  const opacityStyle = isDisabled
    ? styles.disabled
    : isLoading
      ? styles.loading
      : null;

  const getAccessoryRight = (): RenderProp<Partial<ImageProps>> | undefined => {
    if (isLoading) {
      return () => (
        <LoadingSpinner
          color={
            appearance === 'filled' ? theme.colors.basic100 : variantStyle.text
          }
          inline
          size="small"
        />
      );
    }
    return accessoryRight;
  };

  return (
    <Animated.View
      style={[styles.wrapper, animatedStyle, shadowStyle, opacityStyle, style]}
      onLayout={onLayout}>
      {appearance !== 'filled' && (
        <Animated.View
          pointerEvents="none"
          style={[styles.pressOverlay, overlayStyle]}
        />
      )}

      <KittenButton
        appearance={appearance}
        disabled={isInteractionDisabled}
        size={size}
        accessoryRight={getAccessoryRight()}
        status="control"
        style={[styles.button, extraStyle]}
        onPress={handlePress}
        {...handlers}
        accessibilityLabel={accessibilityLabel ?? buttonText}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          busy: isLoading,
        }}>
        {(evaProps?: TextProps) => (
          <View style={styles.content}>
            {!!buttonText && (
              <Text
                {...evaProps}
                numberOfLines={numberOfLines}
                adjustsFontSizeToFit={adjustsFontSizeToFit}
                style={[
                  styles.buttonText,
                  { color: variantStyle.text },
                  textStyle,
                ]}>
                {buttonText}
              </Text>
            )}
            {children}
          </View>
        )}
      </KittenButton>
    </Animated.View>
  );
};
