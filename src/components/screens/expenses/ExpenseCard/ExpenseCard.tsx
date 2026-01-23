import React, { FC, useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Transaction, Category, BankAccount, BankCard } from '@/types';

import { getExpenseCardData, formatSubtitle } from './ExpenseCard.helpers';

interface IExpenseCardProps {
  transaction: Transaction;
  categories: Category[];
  bankAccounts: BankAccount[];
  bankCards: BankCard[];
  onPress: (transaction: Transaction) => void;
}

export const ExpenseCard: FC<IExpenseCardProps> = ({
  transaction,
  categories,
  bankAccounts,
  bankCards,
  onPress,
}) => {
  const { t } = useTranslation('expensesPage');

  // Derived data
  const cardData = useMemo(
    () => getExpenseCardData(transaction, categories, bankAccounts, bankCards),
    [transaction, categories, bankAccounts, bankCards],
  );

  const subtitle = useMemo(
    () =>
      formatSubtitle(
        cardData,
        transaction.recurrent,
        t('expensesPage:recurrent'),
      ),
    [cardData, transaction.recurrent, t],
  );

  return (
    <Pressable onPress={() => onPress(transaction)} style={styles.container}>
      {/* Icon */}
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                cardData.category?.categoryColor?.hexCode ||
                theme.colors.primary,
            },
          ]}>
          <Icon
            // TODO fix icon
            // name={cardData.category?.categoryIcon?.iconName || 'cube-outline'}
            name={'cube-outline'}
            color={theme.colors.basic100}
            size={28}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.centerContainer}>
        <Text category="s1" style={styles.title} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text category="p2" style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Amount & Status */}
      <View style={styles.rightContainer}>
        <Text category="p2" style={styles.amount}>
          {transaction.money} €
        </Text>
        <Icon
          name={
            transaction.recived
              ? 'checkmark-circle-2-outline'
              : 'close-circle-outline'
          }
          color={transaction.recived ? theme.colors.green : theme.colors.red}
          size={20}
        />
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
