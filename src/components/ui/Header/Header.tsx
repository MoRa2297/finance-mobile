import React, { useCallback, ReactNode, FC } from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui';
import { CustomAvatar } from '@/components/common';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';

type LeftContentType =
  | {
      type: 'back';
      variant?: 'icon' | 'text';
      text?: string;
      onPress?: () => void;
    }
  | { type: 'avatar'; source?: string; onPress?: () => void }
  | { type: 'custom'; render: () => ReactNode }
  | { type: 'none' };

type CenterContentType =
  | { type: 'title'; title: string; subtitle?: string }
  | { type: 'custom'; render: () => ReactNode }
  | { type: 'none' };

type RightContentType =
  | { type: 'settings'; onPress: () => void }
  | { type: 'visibility'; isVisible: boolean; onToggle: () => void }
  | { type: 'custom'; render: () => ReactNode }
  | { type: 'none' };

interface IHeaderProps {
  left?: LeftContentType;
  center?: CenterContentType;
  right?: RightContentType;
  style?: ViewStyle;
}

export const Header: FC<IHeaderProps> = ({
  left = { type: 'none' },
  center = { type: 'none' },
  right = { type: 'none' },
  style,
}) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (left.type === 'back' && left.onPress) {
      left.onPress();
    } else {
      router.back();
    }
  }, [left, router]);

  const renderLeft = () => {
    switch (left.type) {
      case 'back':
        return left.variant === 'text' ? (
          <Pressable onPress={handleBack} hitSlop={8}>
            <Text category="p1" style={styles.backText}>
              {left.text || 'Back'}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleBack}
            style={styles.backIconButton}
            hitSlop={8}>
            <Icon
              name="arrow-ios-back-outline"
              color={theme.colors.basic100}
              size={24}
            />
          </Pressable>
        );

      case 'avatar':
        return (
          <Pressable onPress={left.onPress} disabled={!left.onPress}>
            <CustomAvatar size="medium" source={left.source} />
          </Pressable>
        );

      case 'custom':
        return left.render();

      default:
        return null;
    }
  };

  const renderCenter = () => {
    switch (center.type) {
      case 'title':
        return (
          <View style={styles.titleContainer}>
            <Text category="h6" style={styles.title} numberOfLines={1}>
              {center.title}
            </Text>
            {center.subtitle && (
              <Text category="c1" style={styles.subtitle} numberOfLines={1}>
                {center.subtitle}
              </Text>
            )}
          </View>
        );

      case 'custom':
        return center.render();

      default:
        return null;
    }
  };

  const renderRight = () => {
    switch (right.type) {
      case 'settings':
        return (
          <Pressable
            onPress={right.onPress}
            style={styles.iconButton}
            hitSlop={8}>
            <Icon
              name="more-horizontal-outline"
              color={theme.colors.basic100}
              size={34}
            />
          </Pressable>
        );

      case 'visibility':
        return (
          <Pressable
            onPress={right.onToggle}
            style={styles.iconButton}
            hitSlop={8}>
            <Icon
              name={right.isVisible ? 'eye-outline' : 'eye-off-outline'}
              color={theme.colors.basic100}
              size={34}
            />
          </Pressable>
        );

      case 'custom':
        return right.render();

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Left */}
        <View style={styles.leftContainer}>{renderLeft()}</View>

        {/* Center */}
        <View style={styles.centerContainer}>{renderCenter()}</View>

        {/* Right */}
        <View style={styles.rightContainer}>{renderRight()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 3,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textHint,
    textAlign: 'center',
    marginTop: 2,
  },
  backIconButton: {
    borderColor: theme.colors.basic100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  backText: {
    color: theme.colors.basic100,
  },
  iconButton: {
    padding: 4,
  },
});
