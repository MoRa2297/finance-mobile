import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { PercentObject } from '../PercentObject/PercentObject';

interface BudgetCardProps {
  item: any;
  maxWidth: number;
}

export const BudgetCard: React.FunctionComponent<BudgetCardProps> = ({
  item,
  maxWidth,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Layout style={[styles.container]}>
        <PercentObject
          maxWidth={maxWidth}
          key={item}
          percent={item.percent}
          ringColor={theme['color-primary']}
          ringBgColor={theme['color-primary-BK']}
          clockwise={true}
          bgColor={theme['color-primary-BK']}
        />

        <Layout style={styles.bottomContainer}>
          <Text category={'s2'}>Category</Text>
          <Text category={'c1'} style={styles.priceText}>
            100$
          </Text>
        </Layout>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: '25%',
    paddingHorizontal: 10,
    backgroundColor: theme['color-basic-transparent'],
  },
  bottomContainer: {
    alignItems: 'center',
    backgroundColor: theme['color-basic-transparent'],
    gap: 2,
  },
  priceText: {
    color: theme['color-primary'],
  },
});
