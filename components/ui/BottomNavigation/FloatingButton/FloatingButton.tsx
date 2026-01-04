import { Layout } from '@ui-kitten/components';
import React, { useCallback, useMemo, useState } from 'react';

import { Animated, StyleSheet, Pressable } from 'react-native';
import {Icon} from "../../Icon/Icon";

import { theme } from "../../../../theme"

interface FloatingButtonProps {
  handlePressOption: (type: string) => void;
}

export const FloatingButton: React.FunctionComponent<FloatingButtonProps> = ({
                                                                               handlePressOption,
                                                                             }) => {
  let animation = useMemo(() => new Animated.Value(0), []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue: toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  }, [animation, isOpen]);

  const handlePressAction = useCallback(
      (navigationType: string) => {
        handlePressOption(navigationType);
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
        scaleX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      {
        scaleY: animation.interpolate({
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
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0],
        }),
      },
      {
        scaleX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      {
        scaleY: animation.interpolate({
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
        scaleX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      {
        scaleY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  return (
      <Layout style={[styles.container]}>
        {/* expense */}
        <Animated.View style={[styles.secondaryButton, button1]}>
          <Pressable onPress={() => handlePressAction('expense')}>
            <Icon name="trending-down-outline" color={theme.colors.red} />
          </Pressable>
        </Animated.View>

        {/* card_spending */}
        <Animated.View style={[styles.secondaryButton, button2]}>
          <Pressable onPress={() => handlePressAction('card_spending')}>
            <Icon name="credit-card-outline" color={theme.colors.primary} />
          </Pressable>
        </Animated.View>

        {/* income */}
        <Animated.View style={[styles.secondaryButton, button3]}>
          <Pressable onPress={() => handlePressAction('income')}>
            <Icon name="trending-up-outline" color={theme.colors.green} />
          </Pressable>
        </Animated.View>

        <Pressable onPress={toggleMenu}>
          <Animated.View style={[styles.primaryButton, rotation]}>
            <Icon name="plus-outline" color={theme.colors.white} />
          </Animated.View>
        </Pressable>
      </Layout>
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
    borderRadius: 60 / 2,
    height: 60,
    width: 60,
    zIndex: 1,
  },
  secondaryButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.16,
    shadowOffset: { height: 1, width: 0 },
    zIndex: 1,
    backgroundColor: theme.colors.basic500,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  secondary: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: 'yellow',
    position: 'absolute',
    top: 25,
    left: -85,
    zIndex: 1,
  },
});
