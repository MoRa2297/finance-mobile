import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

interface SettingRowProps {
  title: string;
  iconName: string;
  isLast?: boolean;
  color?: string;
  onPress: () => void;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  title,
  iconName,
  isLast = false,
  color,
  onPress,
}) => {
  const textColor = color || theme.colors.basic100;

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, !isLast && styles.borderBottom]}>
        <Icon name={iconName} color={textColor} size={20} />
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.transparent,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textHint,
  },
  title: {
    fontSize: 16,
  },
});
