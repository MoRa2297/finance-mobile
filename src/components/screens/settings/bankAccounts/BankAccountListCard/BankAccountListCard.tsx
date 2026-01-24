import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';
import { useDataStore } from '@/stores';

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
  const { t } = useTranslation();
  const transactions = useDataStore(state => state.transactions);
  const bankTypes = useDataStore(state => state.bankTypes);

  // Find bank type image
  const bankTypeImage = useMemo(() => {
    return bankTypes.find(bt => bt.id === bankAccount.bankTypeId);
  }, [bankTypes, bankAccount.bankTypeId]);

  // Calculate current balance
  const currentBalance = useMemo(() => {
    const accountTransactions = transactions.filter(
      t => t.bankAccountId === bankAccount.id && t.recived,
    );

    const totIncome = accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.money), 0);

    const totSpent = accountTransactions
      .filter(t => t.type === 'expense' || t.type === 'card_spending')
      .reduce((sum, t) => sum + parseFloat(t.money), 0);

    return bankAccount.startingBalance + totIncome - totSpent;
  }, [bankAccount, transactions]);

  return (
    <Pressable style={styles.container} onPress={() => onPress(bankAccount)}>
      {/* Bank Image */}
      <View style={styles.imageContainer}>
        {bankTypeImage?.imageUrl ? (
          <Image
            source={{ uri: bankTypeImage.imageUrl }}
            style={styles.image}
          />
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

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Text category="h6" style={styles.title}>
            {bankAccount.name}
          </Text>
          <Pressable onPress={() => onOptionsPress(bankAccount)} hitSlop={10}>
            <Icon
              name="more-horizontal-outline"
              color={theme.colors.basic100}
              size={28}
            />
          </Pressable>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <Text category="s1" style={styles.subtitle}>
            {t('components.bankAccountListCard.currentBalance')}
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: HORIZONTAL_PADDING,
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
