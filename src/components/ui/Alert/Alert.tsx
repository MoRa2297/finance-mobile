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
}

export const Alert: FC<IAlertProps> = ({
  visible,
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
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
                style={[styles.button, styles.buttonBorder]}
                onPress={onSecondaryPress}>
                <Text category="s1" style={styles.buttonText}>
                  {secondaryButtonText}
                </Text>
              </Pressable>
            )}
            <Pressable style={styles.button} onPress={onPrimaryPress}>
              <Text category="s1" style={styles.buttonText}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '75%',
    backgroundColor: theme.colors.secondaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS - 10,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textHint,
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textHint,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.textHint,
  },
  buttonText: {
    color: theme.colors.primary,
  },
});
