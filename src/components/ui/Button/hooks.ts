import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface UsePressAnimationOptions {
  /** Scale value applied on press-in. Default: 0.97 */
  pressedScale?: number;
  /** Whether an overlay opacity animation should run alongside scale. */
  withOverlay?: boolean;
  /** Disables all animation side-effects (e.g. when button is disabled/loading). */
  disabled?: boolean;
}

/**
 * Press animation primitives: scale on press-in, spring back on press-out,
 * optional opacity overlay for transparent surfaces.
 * Returns animated styles and press handlers to spread on a Pressable.
 */
export const usePressAnimation = ({
  pressedScale = 0.97,
  withOverlay = false,
  disabled = false,
}: UsePressAnimationOptions = {}) => {
  const scale = useSharedValue(1);
  const overlay = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlay.value,
  }));

  const onPressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(pressedScale, { duration: 80 });
    if (withOverlay) {
      overlay.value = withTiming(1, { duration: 80 });
    }
  }, [disabled, pressedScale, withOverlay, scale, overlay]);

  const onPressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 220 });
    if (withOverlay) {
      overlay.value = withTiming(0, { duration: 150 });
    }
  }, [disabled, withOverlay, scale, overlay]);

  return {
    animatedStyle,
    overlayStyle,
    handlers: { onPressIn, onPressOut },
  };
};

type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection';

interface UseButtonHapticOptions {
  enabled?: boolean;
  style?: HapticStyle;
}

/**
 * Returns a memoized haptic trigger respecting the `enabled` flag.
 * Use `selection` for low-emphasis actions (icon buttons, toggles),
 * `light`/`medium`/`heavy` for CTAs by importance.
 */
export const useButtonHaptic = ({
  enabled = false,
  style = 'light',
}: UseButtonHapticOptions = {}) => {
  return useCallback(() => {
    if (!enabled) return;

    switch (style) {
      case 'selection':
        Haptics.selectionAsync();
        break;
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }, [enabled, style]);
};
