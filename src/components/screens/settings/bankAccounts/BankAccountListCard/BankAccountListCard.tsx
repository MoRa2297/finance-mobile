// components/screens/settings/bankAccounts/BankAccountListCard.tsx
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount, Transaction } from '@/types';
import { useBankAccountCard } from '@hooks/screens/bankAccounts';
import { EntityImage } from '@components/ui/EntityImage';
import { OptionsButton } from '@components/ui/OptionsButton';

interface BankAccountListCardProps {
  bankAccount: BankAccount;
  allTransactions: Transaction[];
  onPress: (bankAccount: BankAccount) => void;
  onOptionsPress: (bankAccount: BankAccount) => void;
}

export const BankAccountListCard: React.FC<BankAccountListCardProps> = ({
  bankAccount,
  allTransactions,
  onPress,
  onOptionsPress,
}) => {
  const { t } = useTranslation('bankAccountPage');
  const { imageUrl, currentBalance } = useBankAccountCard(
    bankAccount,
    allTransactions,
  );

  return (
    <Pressable style={styles.container} onPress={() => onPress(bankAccount)}>
      <EntityImage
        imageUrl={imageUrl}
        fallbackText={bankAccount.bankType?.name}
        size={45}
        borderRadius={GLOBAL_BORDER_RADIUS / 2}
      />

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: theme.colors.primaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    padding: HORIZONTAL_PADDING,
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
