import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { HORIZONTAL_PADDING } from '../../../config/constants';
import { theme } from '../../../config/theme';
import { Icon } from '../../UI/Icon/Icon';

interface SpecificPriceProps {
  title: string;
  amount: string;
  amountColor: string;
  iconName: string;
  iconColor: string;
}

export const SpecificPrice: React.FunctionComponent<SpecificPriceProps> = ({
  title,
  amount,
  amountColor,
  iconName,
  iconColor,
}) => {
  return (
    <Layout style={[styles.container]}>
      <Layout style={styles.subContainer}>
        <Icon name={iconName} color={iconColor} size={37} style={styles.icon} />
        <Layout>
          <Text style={styles.smallText}>{title}</Text>
          <Text style={[styles.bigText, { color: amountColor }]}>{amount}</Text>
        </Layout>
      </Layout>
    </Layout>
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
    color: theme['text-hint-color'],
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
