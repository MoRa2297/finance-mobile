import React, { FC, useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

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
  const cardData = useMemo(
    () => getExpenseCardData(transaction),
    [transaction],
  );
  const subtitle = useMemo(() => formatSubtitle(cardData), [cardData]);

  return (
    <Pressable
      onPress={() => onPress(transaction)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: cardData.iconBackgroundColor },
        ]}>
        <Icon
          name={cardData.iconName}
          color={theme.colors.basic100}
          size={24}
        />
      </View>

      {/* Center */}
      <View style={styles.centerContainer}>
        <View style={styles.titleRow}>
          <Text category="s1" style={styles.title} numberOfLines={1}>
            {transaction.description}
          </Text>
          {/* Badges */}
          <View style={styles.badges}>
            {cardData.isRecurrent && (
              <Icon
                name="sync-outline"
                color={theme.colors.textHint}
                size={14}
              />
            )}
            {cardData.isTransfer && (
              <Icon
                name="swap-outline"
                color={theme.colors.primary}
                size={14}
              />
            )}
          </View>
        </View>
        <Text category="p2" style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Amount */}
      <Text
        category="s1"
        style={[styles.amount, { color: cardData.amountColor }]}>
        {cardData.amountPrefix}
        {transaction.amount.toFixed(2)} €
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    height: 70,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primaryBK,
  },
  pressed: {
    opacity: 0.7,
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
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    flexShrink: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textHint,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
});
