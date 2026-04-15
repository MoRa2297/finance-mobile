import React, { FC } from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';

interface IAlertProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  destructive?: boolean;
}

export const Alert: FC<IAlertProps> = ({
  visible,
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  destructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text category="s1" style={styles.title}>
              {title}
            </Text>
            {subtitle && (
              <Text category="p2" style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {onSecondaryPress && secondaryButtonText && (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonBorder,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onSecondaryPress}>
                <Text category="s1" style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={onPrimaryPress}>
              <Text
                category="s1"
                style={[
                  styles.primaryButtonText,
                  destructive && styles.destructiveText,
                ]}>
                {primaryButtonText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '75%',
    backgroundColor: theme.colors.secondaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.textHint,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.primaryBK,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryBK,
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.primaryBK,
  },
  primaryButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.textHint,
    fontWeight: '400',
  },
  destructiveText: {
    color: theme.colors.red,
  },
});
