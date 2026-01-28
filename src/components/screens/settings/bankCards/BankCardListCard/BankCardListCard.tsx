import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { ProgressBar, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankCard } from '@/types';
import { useDataStore } from '@/stores';

interface BankCardListCardProps {
  bankCard: BankCard;
  onPress: (bankCard: BankCard) => void;
  onOptionsPress: (bankCard: BankCard) => void;
}

export const BankCardListCard: React.FC<BankCardListCardProps> = ({
  bankCard,
  onPress,
  onOptionsPress,
}) => {
  const { t } = useTranslation('bankCardsPage');
  const transactions = useDataStore(state => state.transactions);
  const cardTypes = useDataStore(state => state.cardTypes);

  // Find card type
  const cardType = useMemo(() => {
    return cardTypes.find(ct => ct.id === bankCard.cardTypeId);
  }, [cardTypes, bankCard.cardTypeId]);

  // Calculate spent value for this card
  const spentValue = useMemo(() => {
    return transactions
      .filter(
        t =>
          t.cardId === bankCard.id && t.type === 'card_spending' && t.recived,
      )
      .reduce((sum, t) => sum + parseFloat(t.money), 0);
  }, [transactions, bankCard.id]);

  // Calculate progress
  const cardLimit = parseFloat(bankCard.cardLimit);
  const progress = cardLimit > 0 ? spentValue / cardLimit : 0;

  return (
    <Pressable style={styles.listItem} onPress={() => onPress(bankCard)}>
      {/* Top Row */}
      <View style={styles.container}>
        {/* Card Image */}
        <View style={styles.accessoryLeftContainer}>
          <View style={styles.iconLeftContainer}>
            {cardType?.imageUrl ? (
              <Image source={{ uri: cardType.imageUrl }} style={styles.image} />
            ) : (
              <Icon
                name="credit-card-outline"
                color={theme.colors.basic100}
                size={24}
              />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.contentTop}>
            <Text category="h6" style={styles.title}>
              {bankCard.name}
            </Text>

            <Pressable onPress={() => onOptionsPress(bankCard)} hitSlop={10}>
              <Icon
                name="more-horizontal-outline"
                color={theme.colors.basic100}
                size={32}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Spent Value Section */}
      {spentValue > 0 && (
        <View style={styles.spentValueContainer}>
          <View style={styles.spentValueContainerTop}>
            <Text category="s1" style={styles.title}>
              {t('bankCardsPage:spentValue')}
            </Text>
            <Text category="s2" style={styles.title}>
              € {spentValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.spentValueContainerBottom}>
            <ProgressBar
              progress={progress}
              size={'giant'}
              status="info"
              style={{ backgroundColor: theme.colors.secondaryBK }}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: HORIZONTAL_PADDING * 2,
    gap: 15,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    paddingVertical: HORIZONTAL_PADDING * 1.5,
    backgroundColor: theme.colors.primaryBK,
  },
  container: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: theme.colors.transparent,
  },
  accessoryLeftContainer: {
    backgroundColor: theme.colors.transparent,
  },
  iconLeftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.transparent,
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  contentTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.transparent,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.basic100,
  },
  spentValueContainer: {
    width: '100%',
    gap: 10,
    backgroundColor: theme.colors.transparent,
  },
  spentValueContainerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.transparent,
  },
  spentValueContainerBottom: {
    backgroundColor: theme.colors.transparent,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
