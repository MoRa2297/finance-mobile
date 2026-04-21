import React, { useCallback } from 'react';
import { Button as KittenButton } from '@ui-kitten/components';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Icon } from '../Icon';
import { theme } from '@config/theme';
import { LoadingSpinner } from '@components/common';

import { usePressAnimation, useButtonHaptic } from './hooks';
import { buttonStyles, iconButtonStyles } from './styles';

interface IconButtonProps {
  iconName: string;
  iconColor?: string;
  /** Icon size in px. Default: 24 */
  iconSize?: number;
  /** Container size in px (tappable area). Default: 44 (iOS HIG minimum) */
  size?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hapticEnabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconColor = theme.colors.primary,
  iconSize = 24,
  size = 44,
  isDisabled = false,
  isLoading = false,
  onPress,
  onLongPress,
  style,
  hapticEnabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isInteractionDisabled = isDisabled || isLoading;

  const { animatedStyle, handlers } = usePressAnimation({
    pressedScale: 0.85,
    disabled: isInteractionDisabled,
  });

  const triggerHaptic = useButtonHaptic({
    enabled: hapticEnabled,
    style: 'selection',
  });

  const handlePress = useCallback(() => {
    if (isInteractionDisabled) return;
    triggerHaptic();
    onPress();
  }, [isInteractionDisabled, triggerHaptic, onPress]);

  return (
    <Animated.View style={animatedStyle}>
      <KittenButton
        appearance="ghost"
        disabled={isInteractionDisabled}
        onPress={handlePress}
        onLongPress={onLongPress}
        {...handlers}
        hitSlop={12}
        style={[
          iconButtonStyles.container,
          isDisabled && buttonStyles.disabled,
          isLoading && buttonStyles.loading,
          { width: size, height: size },
          style,
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          busy: isLoading,
        }}>
        {() =>
          isLoading ? (
            <LoadingSpinner color={iconColor} inline size="small" />
          ) : (
            <Icon name={iconName} color={iconColor} size={iconSize} />
          )
        }
      </KittenButton>
    </Animated.View>
  );
};
