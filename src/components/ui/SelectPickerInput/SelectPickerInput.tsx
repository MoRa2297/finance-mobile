import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

interface SelectPickerInputProps {
  placeholder: string;
  value?: number | string;
  iconName?: string;
  onPress: () => void;
}

export const SelectPickerInput: React.FC<SelectPickerInputProps> = ({
  placeholder,
  value,
  iconName,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Left Icon */}
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={24} />
        </View>
      )}

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text category="s1" style={styles.placeholder}>
          {placeholder}
        </Text>
        {value !== undefined && (
          <Text category="s1" style={styles.value}>
            {value}
          </Text>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: theme.colors.textHint,
    fontWeight: '500',
  },
  value: {
    color: theme.colors.basic100,
    fontWeight: '500',
  },
  iconRightContainer: {
    paddingLeft: 10,
  },
});
