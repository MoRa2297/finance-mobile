import React, { FC } from 'react';
import { StyleSheet, View, TextInput, KeyboardTypeOptions } from 'react-native';

import { theme } from '@/config/theme';
import { Icon } from '@components/ui/Icon';

interface IInputIconFieldProps {
  value?: string;
  placeholder?: string;
  onChange: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  iconName?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  borderBottom?: boolean;
  editable?: boolean;
}

export const InputIconField: FC<IInputIconFieldProps> = ({
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  iconName,
  keyboardType = 'default',
  secureTextEntry = false,
  borderBottom = true,
  editable = true,
}) => {
  return (
    <View style={[styles.container, borderBottom && styles.borderBottom]}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={24} />
        </View>
      )}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textHint}
        onChangeText={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.colors.transparent,
  },
  borderBottom: {
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.basic100,
    backgroundColor: theme.colors.transparent,
  },
});
