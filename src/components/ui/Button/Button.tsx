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

import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';
import { Icon } from '../Icon';
import { theme } from '@config/theme';

interface ButtonProps {
  adjustsFontSizeToFit?: boolean;
  buttonText?: string;
  appearance?: 'filled' | 'outline' | 'ghost';
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
  const extraStyle = {
    backgroundColor: backgroundColor
      ? backgroundColor
      : appearance === 'filled'
        ? theme.colors.basic100
        : theme.colors.transparent,
    color: color
      ? color
      : appearance === 'filled'
        ? theme.colors.basic500
        : theme.colors.basic100,
    borderWidth: 2,
    borderColor: borderColor
      ? borderColor
      : appearance === 'filled'
        ? theme.colors.basic100
        : theme.colors.transparent,
  };

  const getAccessoryRight = (): RenderProp<Partial<ImageProps>> | undefined => {
    if (isLoading) {
      return () => (
        <LoadingSpinner
          color={
            appearance === 'filled'
              ? theme.colors.primaryBK
              : theme.colors.basic100
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
      disabled={isDisabled}
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
              style={[styles.buttonText, textStyle]}>
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
    opacity: 0.85,
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
  iconColor = theme.colors.basic500,
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
