import React, { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';

// ============ TYPES ============

type TransactionType = 'income' | 'expense' | 'card_spending';

interface FloatingButtonProps {
  handlePressOption: (type: TransactionType) => void;
}

interface ActionButton {
  type: TransactionType;
  icon: string;
  color: string;
  angle: number; // Position angle in degrees (0° = right, 90° = down, 180° = left, 270° = up)
  distance: number; // Distance from center in pixels
}

// ============ CONSTANTS ============

/**
 * Configuration for the action buttons that fan out from the main button.
 * Each button has:
 * - type: Transaction type to pass to the handler
 * - icon: Eva icon name
 * - color: Icon color
 * - angle: Position in degrees (measured clockwise from right)
 * - distance: How far from center the button moves
 */
const ACTION_BUTTONS: ActionButton[] = [
  {
    type: 'expense',
    icon: 'trending-down-outline',
    color: theme.colors.red,
    angle: 210, // Bottom-left position
    distance: 90,
  },
  {
    type: 'card_spending',
    icon: 'credit-card-outline',
    color: theme.colors.primary,
    angle: 270, // Top-center position
    distance: 100,
  },
  {
    type: 'income',
    icon: 'trending-up-outline',
    color: theme.colors.green,
    angle: 330, // Bottom-right position
    distance: 90,
  },
];

// ============ COMPONENT ============

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  handlePressOption,
}) => {
  /**
   * Animation value that drives all animations.
   * - 0 = closed state (buttons hidden, plus icon normal)
   * - 1 = open state (buttons visible, plus icon rotated to X)
   *
   * Using useRef instead of useState because:
   * - Animated.Value is mutable and shouldn't trigger re-renders
   * - useRef persists the value across renders without causing re-renders
   */
  const animation = useRef(new Animated.Value(0)).current;

  /**
   * Tracks whether the menu is open or closed.
   * Used for toggling the animation direction.
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the menu open/closed with a spring animation.
   * Spring animation provides a natural, bouncy feel.
   */
  const toggleMenu = useCallback(() => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 6, // Controls bounciness (lower = more bouncy)
      tension: 40, // Controls speed (higher = faster)
      useNativeDriver: true, // Offloads animation to native thread for better performance
    }).start();

    setIsOpen(!isOpen);
  }, [animation, isOpen]);

  /**
   * Handles when an action button is pressed.
   * 1. Calls the parent handler with the transaction type
   * 2. Closes the menu with a slight delay to show the press feedback
   */
  const handlePressAction = useCallback(
    (type: TransactionType) => {
      // Notify parent of the selected action
      handlePressOption(type);

      // Close menu after a short delay for visual feedback
      setTimeout(() => {
        Animated.spring(animation, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }).start();
        setIsOpen(false);
      }, 100);
    },
    [animation, handlePressOption],
  );

  /**
   * Generates animated styles for each action button based on angle and distance.
   * Uses polar coordinates (angle + distance) converted to cartesian (x, y).
   *
   * Math explanation:
   * - radians = angle * (π / 180) converts degrees to radians
   * - x = cos(radians) * distance gives horizontal offset
   * - y = sin(radians) * distance gives vertical offset
   *
   * Animation interpolation:
   * - translateX/Y: Moves button from center (0) to final position
   * - scale: Grows button from 0 to full size with a slight acceleration at 0.5
   * - opacity: Fades button in as it moves
   */
  const getButtonStyle = (angle: number, distance: number) => {
    const radians = (angle * Math.PI) / 180;

    return {
      transform: [
        {
          // Horizontal movement
          translateX: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.cos(radians) * distance],
          }),
        },
        {
          // Vertical movement
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.sin(radians) * distance],
          }),
        },
        {
          // Scale with easing: starts slow, accelerates, then settles
          scale: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.3, 1],
          }),
        },
      ],
      // Fade in as button expands
      opacity: animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    };
  };

  /**
   * Animated styles for the main button.
   * - Rotates 45° to transform "+" into "×" when open
   * - Slight scale pulse during animation for tactile feedback
   */
  const mainButtonRotation = {
    transform: [
      {
        // Rotate plus icon to become X icon
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
      {
        // Subtle scale effect: normal → slightly smaller → normal
        scale: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.9, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/*
        Action Buttons - Rendered behind main button (appear when menu opens)
        Each button is positioned absolutely and animated to fan out
      */}
      {ACTION_BUTTONS.map(button => (
        <Animated.View
          key={button.type}
          style={[
            styles.secondaryButton,
            getButtonStyle(button.angle, button.distance),
          ]}>
          <Pressable
            onPress={() => handlePressAction(button.type)}
            style={styles.secondaryButtonPressable}>
            <Icon name={button.icon} color={button.color} size={24} />
          </Pressable>
        </Animated.View>
      ))}

      {/*
        Main Button - Always visible, toggles the menu
        Higher zIndex ensures it stays on top of action buttons
      */}
      <Pressable onPress={toggleMenu} style={styles.mainButtonPressable}>
        <Animated.View style={[styles.primaryButton, mainButtonRotation]}>
          <Icon name="plus-outline" color={theme.colors.white} size={28} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  /**
   * Container centers all buttons.
   * Action buttons use absolute positioning relative to this container.
   */
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },

  /**
   * Main floating action button (FAB).
   * - Circular shape with shadow for depth
   * - Primary color to stand out
   */
  primaryButton: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 60,
    width: 60,
    // Shadow for iOS
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
    // Shadow for Android
    elevation: 8,
  },

  /**
   * Pressable wrapper for main button.
   * High zIndex keeps it above action buttons.
   */
  mainButtonPressable: {
    zIndex: 10,
  },

  /**
   * Secondary action buttons.
   * - Positioned absolutely so they stack in center
   * - Smaller than main button to create hierarchy
   * - Animated to fan out when menu opens
   */
  secondaryButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondaryBK,
    // Shadow for iOS
    shadowColor: theme.colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { height: 3, width: 0 },
    // Shadow for Android
    elevation: 6,
  },

  /**
   * Inner pressable area for action buttons.
   * Full size ensures the entire button is tappable.
   */
  secondaryButtonPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
