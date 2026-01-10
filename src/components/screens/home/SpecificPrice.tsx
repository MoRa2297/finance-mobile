import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@config/constants';

interface SpecificPriceProps {
  title: string;
  amount: string;
  amountColor: string;
  iconName: string;
  iconColor: string;
}

export const SpecificPrice: React.FC<SpecificPriceProps> = ({
  title,
  amount,
  amountColor,
  iconName,
  iconColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Icon name={iconName} color={iconColor} size={37} style={styles.icon} />
        <View>
          <Text style={styles.smallText}>{title}</Text>
          <Text style={[styles.bigText, { color: amountColor }]}>{amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallText: {
    color: theme.colors.textHint,
    fontWeight: '500',
    fontSize: 13,
  },
  bigText: {
    fontSize: 24,
    fontWeight: '500',
  },
  icon: {
    margin: 5,
  },
});
