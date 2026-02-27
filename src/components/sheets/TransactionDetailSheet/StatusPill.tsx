import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Icon } from '@components/ui/Icon';

interface StatusPillProps {
  isActive?: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeColor: string;
  inactiveColor: string;
  iconActive: string;
  iconInactive: string;
}

export const StatusPill: FC<StatusPillProps> = ({
  isActive,
  activeLabel,
  inactiveLabel,
  activeColor,
  inactiveColor,
  iconActive,
  iconInactive,
}) => {
  const color = isActive ? activeColor : inactiveColor;
  const icon = isActive ? iconActive : iconInactive;
  const label = isActive ? activeLabel : inactiveLabel;

  return (
    <View
      style={[
        styles.pill,
        { borderColor: color + '50', backgroundColor: color + '18' },
      ]}>
      <Icon name={icon} color={color} size={15} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
