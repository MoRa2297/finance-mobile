import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';
import { useBankAccountCard } from '@hooks/screens/bankAccounts';

interface BankAccountListCardProps {
  bankAccount: BankAccount;
  onPress: (bankAccount: BankAccount) => void;
  onOptionsPress: (bankAccount: BankAccount) => void;
}

export const BankAccountListCard: React.FC<BankAccountListCardProps> = ({
  bankAccount,
  onPress,
  onOptionsPress,
}) => {
  const { t } = useTranslation('bankAccountPage');
  const { imageUrl, currentBalance } = useBankAccountCard(bankAccount);

  return (
    <Pressable style={styles.container} onPress={() => onPress(bankAccount)}>
      <BankImage imageUrl={imageUrl} />

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text category="h6" style={styles.title}>
            {bankAccount.name}
          </Text>
          <OptionsButton onPress={() => onOptionsPress(bankAccount)} />
        </View>

        <View style={styles.bottomRow}>
          <Text category="s1" style={styles.subtitle}>
            {t('bankAccountPage:currentBalance')}
          </Text>
          <Text category="s1" style={styles.money}>
            € {currentBalance.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

// ============ Sub-components ============

interface BankImageProps {
  imageUrl: string | null;
}

const BankImage: React.FC<BankImageProps> = ({ imageUrl }) => (
  <View style={styles.imageContainer}>
    {imageUrl ? (
      <Image source={{ uri: imageUrl }} style={styles.image} />
    ) : (
      <View style={styles.imagePlaceholder}>
        <Icon
          name="credit-card-outline"
          color={theme.colors.basic100}
          size={24}
        />
      </View>
    )}
  </View>
);

interface OptionsButtonProps {
  onPress: () => void;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({ onPress }) => (
  <Pressable onPress={onPress} hitSlop={10}>
    <Icon
      name="more-horizontal-outline"
      color={theme.colors.basic100}
      size={28}
    />
  </Pressable>
);

// ============ Styles ============

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: theme.colors.primaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    padding: HORIZONTAL_PADDING,
  },
  imageContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.basic100,
  },
  subtitle: {
    color: theme.colors.textHint,
  },
  money: {
    color: theme.colors.basic100,
  },
});
