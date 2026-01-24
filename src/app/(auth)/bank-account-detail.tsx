import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { GenericSmallDetail } from '@/components';

export default function BankAccountDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Stores
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankTypes = useDataStore(state => state.bankTypes);
  const bankAccountTypes = useDataStore(state => state.bankAccountTypes);
  const transactions = useDataStore(state => state.transactions);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // Find bank account
  const bankAccount = useMemo(() => {
    return bankAccounts.find(ba => ba.id === Number(id));
  }, [bankAccounts, id]);

  // Find bank type
  const bankType = useMemo(() => {
    if (!bankAccount) return null;
    return bankTypes.find(bt => bt.id === bankAccount.bankTypeId);
  }, [bankAccount, bankTypes]);

  // Find bank account type
  const bankAccountType = useMemo(() => {
    if (!bankAccount) return null;
    return bankAccountTypes.find(
      bat => bat.id === bankAccount.bankAccountTypeId,
    );
  }, [bankAccount, bankAccountTypes]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!bankAccount) {
      return {
        totIncome: 0,
        totSpent: 0,
        currentBalance: 0,
        countIncome: 0,
        countSpent: 0,
      };
    }

    const accountTransactions = transactions.filter(
      t => t.bankAccountId === bankAccount.id && t.recived,
    );

    const incomeTransactions = accountTransactions.filter(
      t => t.type === 'income',
    );
    const spentTransactions = accountTransactions.filter(
      t => t.type === 'expense' || t.type === 'card_spending',
    );

    const totIncome = incomeTransactions.reduce(
      (sum, t) => sum + parseFloat(t.money),
      0,
    );
    const totSpent = spentTransactions.reduce(
      (sum, t) => sum + parseFloat(t.money),
      0,
    );

    return {
      totIncome,
      totSpent,
      currentBalance: bankAccount.startingBalance + totIncome - totSpent,
      countIncome: incomeTransactions.length,
      countSpent: spentTransactions.length,
    };
  }, [bankAccount, transactions]);

  // Handlers
  const handleSettingsPress = useCallback(() => {
    const options = [
      t('screens.bankAccountDetailScreen.edit'),
      t('common.cancel'),
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // containerStyle: [
        //   styles.actionSheetContainer,
        //   { marginBottom: insets.bottom },
        // ],
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push({
            pathname: '/(auth)/bank-account-form',
            params: { id: bankAccount?.id },
          });
        }
      },
    );
  }, [t, insets.bottom, showActionSheetWithOptions, router, bankAccount?.id]);

  if (!bankAccount) {
    return (
      <ScreenContainer style={styles.container}>
        {/*<Header title={t('common.error')} showBackButton />*/}
        <View style={styles.errorContainer}>
          <Text category="s1" style={styles.errorText}>
            {t('screens.bankAccountDetailScreen.notFound')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header */}
      {/*<Header*/}
      {/*  title={bankAccount.name}*/}
      {/*  showBackButton*/}
      {/*  onSettingsPress={handleSettingsPress}*/}
      {/*/>*/}

      {/* Content */}
      <View
        style={[styles.contentContainer, { paddingBottom: bottomTabHeight }]}>
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text category="p2" style={styles.balanceLabel}>
            {t('screens.bankAccountDetailScreen.currentBalance')}
          </Text>
          <Text category="h4" style={styles.balanceAmount}>
            € {stats.currentBalance.toFixed(2)}
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Bank Name */}
          <View style={styles.singleRowContainer}>
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.bankName')}
              imageUrl={bankType?.imageUrl}
              value={bankType?.name}
            />
          </View>

          {/* Account Type & Starting Balance */}
          <View style={styles.rowContainer}>
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.accountType')}
              iconName="grid-outline"
              value={
                bankAccountType
                  ? t(`common.bankAccountTypes.${bankAccountType.name}`)
                  : '-'
              }
            />
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.startingBalance')}
              iconName="award-outline"
              value={`€ ${bankAccount.startingBalance.toFixed(2)}`}
            />
          </View>

          {/* Spent & Income Count */}
          <View style={styles.rowContainer}>
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.spentQuantity')}
              iconName="trending-down-outline"
              value={stats.countSpent}
              valueColor={theme.colors.red}
            />
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.incomeQuantity')}
              iconName="trending-up-outline"
              value={stats.countIncome}
              valueColor={theme.colors.green}
            />
          </View>

          {/* Total Transfers */}
          <View style={styles.singleRowContainer}>
            <GenericSmallDetail
              title={t('screens.bankAccountDetailScreen.totalTransfers')}
              iconName="repeat-outline"
              value={stats.countSpent + stats.countIncome}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.textHint,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 15,
  },
  balanceSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
  },
  balanceLabel: {
    color: theme.colors.textHint,
    fontSize: 16,
  },
  balanceAmount: {
    color: theme.colors.basic100,
    marginTop: 8,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 20,
    gap: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  singleRowContainer: {
    flexDirection: 'row',
  },
  actionSheetContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  actionSheetText: {
    textAlign: 'center',
    color: theme.colors.basic100,
  },
});
