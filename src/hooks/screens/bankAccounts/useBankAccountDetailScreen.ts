import { useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useDataStore } from '@/stores';
import {
  selectTransactions,
  selectBankAccounts,
  selectBankTypes,
  selectBankAccountTypes,
  findBankAccountById,
  findBankTypeById,
  findBankAccountTypeById,
  calculateAccountStats,
} from '@/stores/data/data.selectors';
import { theme } from '@/config/theme';

export const useBankAccountDetailScreen = () => {
  const { t } = useTranslation('bankAccountPage');
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store data
  const bankAccounts = useDataStore(selectBankAccounts);
  const bankTypes = useDataStore(selectBankTypes);
  const bankAccountTypes = useDataStore(selectBankAccountTypes);
  const transactions = useDataStore(selectTransactions);

  // Derived data
  const bankAccount = useMemo(
    () => findBankAccountById(bankAccounts, Number(id)),
    [bankAccounts, id],
  );

  const bankType = useMemo(
    () =>
      bankAccount ? findBankTypeById(bankTypes, bankAccount.bankTypeId) : null,
    [bankAccount, bankTypes],
  );

  const bankAccountType = useMemo(
    () =>
      bankAccount
        ? findBankAccountTypeById(
            bankAccountTypes,
            bankAccount.bankAccountTypeId,
          )
        : null,
    [bankAccount, bankAccountTypes],
  );

  const stats = useMemo(
    () => calculateAccountStats(bankAccount, transactions),
    [bankAccount, transactions],
  );

  // Action sheet styles
  const actionSheetStyles = useMemo(
    () => ({
      containerStyle: {
        borderRadius: 20,
        backgroundColor: theme.colors.secondaryBK,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.colors.primaryBK,
        marginBottom: insets.bottom,
      },
      textStyle: {
        textAlign: 'center' as const,
        color: theme.colors.basic100,
      },
    }),
    [insets.bottom],
  );

  // Handlers
  const handleSettingsPress = useCallback(() => {
    const options = [t('common:edit'), t('common:cancel')];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0 && bankAccount) {
          router.push({
            pathname: '/(auth)/bank-accounts/bank-account-form',
            params: { id: bankAccount.id },
          });
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, router, bankAccount]);

  // Formatted values
  const formattedValues = useMemo(
    () => ({
      currentBalance: `€ ${stats.currentBalance.toFixed(2)}`,
      startingBalance: `€ ${bankAccount?.startingBalance.toFixed(2) ?? '0.00'}`,
      accountTypeName: bankAccountType
        ? t(`bankAccountPage:types.${bankAccountType.name}`)
        : '-',
    }),
    [stats.currentBalance, bankAccount?.startingBalance, bankAccountType, t],
  );

  return {
    // Data
    bankAccount,
    bankType,
    stats,
    formattedValues,

    // Handlers
    handleSettingsPress,

    // State
    isNotFound: !bankAccount,
  };
};
