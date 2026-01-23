import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';
import { Icon } from '@components/ui/Icon';

interface SpecificPriceProps {
  title: string;
  amount: string;
  amountColor?: string;
  iconName: string;
  iconColor?: string;
}

export const SpecificPrice: React.FC<SpecificPriceProps> = ({
  title,
  amount,
  amountColor = theme.colors.basic100,
  iconName,
  iconColor = theme.colors.basic100,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} color={iconColor} size={24} />
      </View>
      <View style={styles.textContainer}>
        <Text category="c1" style={styles.title}>
          {title}
        </Text>
        <Text category="s1" style={[styles.amount, { color: amountColor }]}>
          {amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.transparent,
  },
  iconContainer: {
    backgroundColor: theme.colors.transparent,
  },
  textContainer: {
    backgroundColor: theme.colors.transparent,
  },
  title: {
    color: theme.colors.textHint,
    fontWeight: '500',
  },
  amount: {
    fontWeight: '600',
  },
});
