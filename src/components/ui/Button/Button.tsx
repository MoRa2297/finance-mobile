import React from 'react';
import { Button as KittenButton, Text } from '@ui-kitten/components';
import {
  ImageProps,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { RenderProp } from '@ui-kitten/components/devsupport';

import { Icon } from '../Icon';
import { theme } from '@config/theme';
import { LoadingSpinner } from '@components/common';

type ButtonAppearance = 'filled' | 'outline' | 'ghost';

const appearanceStyles: Record<
  ButtonAppearance,
  { bg: string; text: string; border: string; borderWidth: number }
> = {
  filled: {
    bg: theme.colors.primary,
    text: theme.colors.basic100,
    border: theme.colors.primary,
    borderWidth: 0,
  },
  outline: {
    bg: theme.colors.transparent,
    text: theme.colors.primary,
    border: theme.colors.primary,
    borderWidth: 2,
  },
  ghost: {
    bg: theme.colors.transparent,
    text: theme.colors.primary,
    border: theme.colors.transparent,
    borderWidth: 0,
  },
};

interface ButtonProps {
  adjustsFontSizeToFit?: boolean;
  buttonText?: string;
  appearance?: ButtonAppearance;
  isDisabled?: boolean;
  numberOfLines?: number;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode[];
  textStyle?: StyleProp<TextStyle>;
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  adjustsFontSizeToFit,
  buttonText,
  appearance = 'filled',
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
  backgroundColor,
  color,
  borderColor,
}) => {
  const variantStyle = appearanceStyles[appearance];

  const extraStyle = {
    backgroundColor: backgroundColor ?? variantStyle.bg,
    borderWidth: variantStyle.borderWidth,
    borderColor: borderColor ?? variantStyle.border,
  };

  const textColor = color ?? variantStyle.text;

  const getAccessoryRight = (): RenderProp<Partial<ImageProps>> | undefined => {
    if (isLoading) {
      return () => (
        <LoadingSpinner
          color={
            appearance === 'filled'
              ? theme.colors.basic100
              : theme.colors.primary
          }
          inline
          size="small"
        />
      );
    }
    return accessoryRight;
  };

  return (
    <KittenButton
      appearance={appearance}
      disabled={isDisabled || isLoading}
      size={size}
      accessoryRight={getAccessoryRight()}
      status="control"
      style={[styles.button, extraStyle, isDisabled && styles.opacity, style]}
      onPress={onPress}
      onLayout={onLayout}>
      {(evaProps: any) => (
        <View style={styles.content}>
          {!!buttonText && (
            <Text
              {...evaProps}
              numberOfLines={numberOfLines}
              adjustsFontSizeToFit={adjustsFontSizeToFit}
              style={[styles.buttonText, { color: textColor }, textStyle]}>
              {buttonText.toUpperCase()}
            </Text>
          )}
          {children}
        </View>
      )}
    </KittenButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  opacity: {
    opacity: 0.5,
  },
});

interface IconButtonProps {
  iconName: string;
  iconColor?: string;
  size?: number;
  isDisabled?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const IconButton: React.FunctionComponent<IconButtonProps> = ({
  iconName,
  iconColor = theme.colors.primary,
  isDisabled = false,
  size = 32,
  onPress,
  onLongPress,
  style,
}) => {
  return (
    <KittenButton
      appearance={'ghost'}
      disabled={isDisabled}
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={{
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
      }}
      style={[
        isDisabled && styles.opacity,
        {
          width: size,
          height: size,
        },
        style,
      ]}>
      {() => <Icon name={iconName} color={iconColor} size={size} />}
    </KittenButton>
  );
};
