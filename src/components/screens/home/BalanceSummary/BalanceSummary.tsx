import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';

import { SpecificPrice } from '../SpecificPrice';
import { BalanceData, formatMoney } from './BalanceSummary.helpers';

interface BalanceSummaryProps {
  balance: BalanceData;
  moneyIsVisible: boolean;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balance,
  moneyIsVisible,
}) => {
  const { t } = useTranslation('homePage');

  return (
    <View style={styles.container}>
      {/* Account Balance */}
      <View style={styles.accountBalanceContainer}>
        <Text style={styles.smallText}>{t('homePage:accountBalance')}</Text>
        <Text style={styles.bigText}>
          {formatMoney(balance.totalResidue, moneyIsVisible)}
        </Text>
      </View>

      {/* Income / Expense */}
      <View style={styles.amountContainer}>
        <SpecificPrice
          title={t('homePage:incomesMiniTitle')}
          amount={formatMoney(balance.totalIncome, moneyIsVisible)}
          amountColor={theme.colors.green}
          iconName="arrow-circle-down"
          iconColor={theme.colors.green}
        />
        <SpecificPrice
          title={t('homePage:expensesMiniTitle')}
          amount={formatMoney(balance.totalExpense, moneyIsVisible)}
          amountColor={theme.colors.red}
          iconName="arrow-circle-up"
          iconColor={theme.colors.red}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  accountBalanceContainer: {
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
  },
  smallText: {
    color: theme.colors.textHint,
    fontWeight: '500',
    fontSize: 13,
  },
  bigText: {
    fontSize: 28,
    color: theme.colors.basic100,
  },
});
