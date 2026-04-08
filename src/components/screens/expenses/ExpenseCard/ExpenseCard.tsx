import React, { FC, useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Transaction } from '@/types';
import { getExpenseCardData, formatSubtitle } from './ExpenseCard.helpers';

interface IExpenseCardProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export const ExpenseCard: FC<IExpenseCardProps> = ({
  transaction,
  onPress,
}) => {
  const { t } = useTranslation('expensesPage');

  const cardData = useMemo(
    () => getExpenseCardData(transaction),
    [transaction],
  );

  const subtitle = useMemo(
    () => formatSubtitle(cardData, t('expensesPage:recurrent')),
    [cardData, t],
  );

  return (
    <Pressable onPress={() => onPress(transaction)} style={styles.container}>
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: cardData.categoryColor ?? theme.colors.primary },
          ]}>
          <Icon
            name={cardData.categoryIconName ?? 'cube-outline'}
            color={theme.colors.basic100}
            size={28}
          />
        </View>
      </View>

      <View style={styles.centerContainer}>
        <Text category="s1" style={styles.title} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text category="p2" style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <Text category="p2" style={styles.amount}>
          {transaction.amount} €
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
    height: 70,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primaryBK,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textHint,
  },
  amount: {
    marginBottom: 4,
  },
});
