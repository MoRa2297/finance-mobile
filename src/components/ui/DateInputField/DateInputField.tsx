import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

interface DateInputFieldProps {
  value?: string;
  iconName?: string;
  placeholder?: string;
  customBackgroundColor?: string;
  onPress: () => void;
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  value,
  iconName,
  placeholder = 'Select date',
  customBackgroundColor,
  onPress,
}) => {
  return (
    <Pressable
      style={[
        styles.container,
        customBackgroundColor && { backgroundColor: customBackgroundColor },
      ]}
      onPress={onPress}>
      {/* Left Icon */}
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={24} />
        </View>
      )}

      {/* Value */}
      <View style={styles.contentContainer}>
        <Text category="s1" style={[styles.text, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
      </View>

      {/* Right Icon */}
      <View style={styles.iconRightContainer}>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={24}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.colors.transparent,
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: theme.colors.basic100,
    fontWeight: '500',
  },
  placeholder: {
    color: theme.colors.textHint,
  },
  iconRightContainer: {
    paddingLeft: 10,
  },
});
