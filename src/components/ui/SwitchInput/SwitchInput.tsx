import React, { FC, useCallback } from 'react';
import { View, Switch, StyleSheet, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';

interface SwitchInputProps {
  value: boolean;
  placeholder: string;
  onValueChange: (value: boolean) => void;
  iconName?: string;
  disabled?: boolean;
}

export const SwitchInput: FC<SwitchInputProps> = ({
  value,
  iconName,
  onValueChange,
  placeholder,
  disabled = false,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value]);

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={24} />
        </View>
      )}

      <Text style={styles.placeholder}>{placeholder}</Text>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.secondaryBK,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.basic100}
        ios_backgroundColor={theme.colors.secondaryBK}
        disabled={disabled}
        style={styles.switch}
      />
    </Pressable>
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
    borderWidth: 1,
    borderColor: 'red',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textHint,
  },
  switch: {
    alignSelf: 'center',
  },
});
