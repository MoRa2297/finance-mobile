import React, { useCallback, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

interface FloatingButtonProps {
  handlePressOption: (type: 'income' | 'expense' | 'card_spending') => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  handlePressOption,
}) => {
  const animation = useMemo(() => new Animated.Value(0), []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  }, [animation, isOpen]);

  const handlePressAction = useCallback(
    (type: 'income' | 'expense' | 'card_spending') => {
      handlePressOption(type);
      toggleMenu();
    },
    [handlePressOption, toggleMenu],
  );

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const button1 = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const button2 = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const button3 = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 80],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Expense */}
      <Animated.View style={[styles.secondaryButton, button1]}>
        <Pressable onPress={() => handlePressAction('expense')}>
          <Icon name="trending-down-outline" color={theme.colors.red} />
        </Pressable>
      </Animated.View>

      {/* Card Spending */}
      <Animated.View style={[styles.secondaryButton, button2]}>
        <Pressable onPress={() => handlePressAction('card_spending')}>
          <Icon name="credit-card-outline" color={theme.colors.primary} />
        </Pressable>
      </Animated.View>

      {/* Income */}
      <Animated.View style={[styles.secondaryButton, button3]}>
        <Pressable onPress={() => handlePressAction('income')}>
          <Icon name="trending-up-outline" color={theme.colors.green} />
        </Pressable>
      </Animated.View>

      {/* Main Button */}
      <Pressable onPress={toggleMenu}>
        <Animated.View style={[styles.primaryButton, rotation]}>
          <Icon name="plus-outline" color={theme.colors.white} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 60,
    width: 60,
    zIndex: 1,
  },
  secondaryButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.16,
    shadowOffset: { height: 1, width: 0 },
    zIndex: 1,
    backgroundColor: theme.colors.primary500,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
