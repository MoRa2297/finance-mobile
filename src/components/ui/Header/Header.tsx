import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backText?: string;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backText,
  onSettingsPress,
  onBackPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress, router]);

  // Back button con icona
  const renderBackIcon = () => (
    <Pressable onPress={handleBack} style={styles.backIconContainer}>
      <Icon
        name="arrow-ios-back-outline"
        color={theme.colors.basic100}
        size={24}
      />
    </Pressable>
  );

  // Back button con testo
  const renderBackText = () => (
    <Pressable onPress={handleBack}>
      <Text category="p1" style={styles.backText}>
        {backText}
      </Text>
    </Pressable>
  );

  // Settings button
  const renderSettingsButton = () => (
    <Pressable onPress={onSettingsPress} style={styles.settingsContainer}>
      <Icon
        name="more-horizontal-outline"
        color={theme.colors.basic100}
        size={28}
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Left */}
        <View style={styles.leftContainer}>
          {showBackButton && (backText ? renderBackText() : renderBackIcon())}
        </View>

        {/* Center */}
        <View style={styles.centerContainer}>
          <Text category="h6" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text category="c1" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right */}
        <View style={styles.rightContainer}>
          {onSettingsPress && renderSettingsButton()}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  backIconContainer: {
    borderColor: theme.colors.basic100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  backText: {
    color: theme.colors.basic100,
  },
  settingsContainer: {
    padding: 4,
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
});
