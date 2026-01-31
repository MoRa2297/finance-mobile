import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import ToggleSwitch from 'toggle-switch-react-native'; // TODO maybe change it

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';

interface SwitchInputProps {
  value: boolean;
  placeholder: string;
  onValueChange: (value: boolean) => void;
  iconName?: string;
  disabled?: boolean;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  iconName,
  onValueChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={28} />
        </View>
      )}

      <Text style={styles.placeholder}>{placeholder}</Text>

      <View style={styles.toggleContainer}>
        <ToggleSwitch
          isOn={value}
          onColor={theme.colors.primary}
          offColor={theme.colors.secondaryBK}
          size="large"
          onToggle={onValueChange}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.colors.transparent,
    borderBottomColor: theme.colors.textHint,
    borderBottomWidth: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: '16%',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textHint,
  },
  toggleContainer: {
    alignItems: 'center',
  },
});
