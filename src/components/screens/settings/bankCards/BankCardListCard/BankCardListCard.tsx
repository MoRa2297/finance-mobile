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

  // TODO: calcolare con transazioni reali
  const spentValue = 0;

  const progress = useMemo(() => {
    return bankCard.cardLimit > 0 ? spentValue / bankCard.cardLimit : 0;
  }, [spentValue, bankCard.cardLimit]);

  const expiryLabel = `${String(bankCard.monthExpiry).padStart(2, '0')}/${bankCard.yearExpiry}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(bankCard)}>
      {/* Top accent line */}
      <View style={styles.topAccent} />

      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerRow}>
          <EntityImage
            imageUrl={bankCard.cardType?.imageUrl}
            fallbackText={bankCard.cardType?.name}
            size={42}
            borderRadius={GLOBAL_BORDER_RADIUS / 2}
          />

          <View style={styles.nameContainer}>
            <Text category="s1" style={styles.name} numberOfLines={1}>
              {bankCard.name}
            </Text>
            <Text category="c1" style={styles.expiry}>
              {t('bankCardsPage:expiry')} {expiryLabel}
            </Text>
          </View>

          <OptionsButton onPress={() => onOptionsPress(bankCard)} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Limit row */}
        <View style={styles.limitRow}>
          <Text category="c1" style={styles.limitLabel}>
            {t('bankCardsPage:limit')}
          </Text>
          <Text category="s1" style={styles.limitAmount}>
            € {bankCard.cardLimit.toFixed(2)}
          </Text>
        </View>

        {/* Progress bar — solo se ci sono spese */}
        {spentValue > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text category="c1" style={styles.limitLabel}>
                {t('bankCardsPage:spentValue')}
              </Text>
              <Text category="c1" style={styles.limitLabel}>
                € {spentValue.toFixed(2)}
              </Text>
            </View>
            <ProgressBar
              progress={progress}
              size="giant"
              status="info"
              style={styles.progressBar}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  topAccent: {
    height: 3,
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  inner: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameContainer: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: theme.colors.basic100,
    fontWeight: '700',
    fontSize: 15,
  },
  expiry: {
    color: theme.colors.textHint,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitLabel: {
    color: theme.colors.textHint,
    fontSize: 12,
  },
  limitAmount: {
    color: theme.colors.basic100,
    fontWeight: '700',
    fontSize: 15,
  },
  progressContainer: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    backgroundColor: theme.colors.secondaryBK,
  },
});
