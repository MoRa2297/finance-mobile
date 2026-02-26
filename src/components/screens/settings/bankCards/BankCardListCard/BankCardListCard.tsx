import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ProgressBar, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankCard } from '@/types';
import { EntityImage } from '@components/ui/EntityImage';
import { OptionsButton } from '@components/ui/OptionsButton';

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

  // TODO: calcolate real transaction
  const spentValue = 0;

  const progress = useMemo(() => {
    return bankCard.cardLimit > 0 ? spentValue / bankCard.cardLimit : 0;
  }, [spentValue, bankCard.cardLimit]);

  const expiryLabel = `${String(bankCard.monthExpiry).padStart(2, '0')}/${bankCard.yearExpiry}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.listItem, pressed && styles.pressed]}
      onPress={() => onPress(bankCard)}>
      <View style={styles.container}>
        {/* Left image */}
        <View style={styles.iconLeftContainer}>
          <EntityImage
            imageUrl={bankCard.cardType?.imageUrl}
            fallbackText={bankCard.cardType?.name}
            size={44}
            borderRadius={GLOBAL_BORDER_RADIUS / 2}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.contentTop}>
            <View style={styles.nameContainer}>
              <Text category="s1" style={styles.title}>
                {bankCard.name}
              </Text>
              <Text category="c1" style={styles.subtitle}>
                {t('bankCardsPage:expiry')} {expiryLabel}
              </Text>
            </View>
            <OptionsButton onPress={() => onOptionsPress(bankCard)} size={28} />
          </View>

          {/* Limit */}
          <View style={styles.limitRow}>
            <Text category="c1" style={styles.limitLabel}>
              {t('bankCardsPage:limit')}
            </Text>
            <Text category="c1" style={styles.limitValue}>
              € {bankCard.cardLimit.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Spent Value Section */}
      {spentValue > 0 && (
        <View style={styles.spentValueContainer}>
          <View style={styles.spentValueContainerTop}>
            <Text category="c1" style={styles.subtitle}>
              {t('bankCardsPage:spentValue')}
            </Text>
            <Text category="c1" style={styles.subtitle}>
              € {spentValue.toFixed(2)}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            size="giant"
            status="info"
            style={{ backgroundColor: theme.colors.secondaryBK }}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 12,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    paddingVertical: HORIZONTAL_PADDING,
    backgroundColor: theme.colors.primaryBK,
  },
  pressed: {
    opacity: 0.85,
  },
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconLeftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 6,
  },
  contentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.basic100,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.textHint,
    fontSize: 11,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitLabel: {
    color: theme.colors.textHint,
    fontSize: 11,
  },
  limitValue: {
    color: theme.colors.basic100,
    fontWeight: '600',
    fontSize: 11,
  },
  spentValueContainer: {
    gap: 6,
  },
  spentValueContainerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
