import { useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useBankAccountStore, bankAccountSelectors } from '@/stores';
import { theme } from '@/config/theme';

export const useBankAccountDetailScreen = () => {
  const { t } = useTranslation('bankAccountPage');
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);

  // Derived
  const bankAccount = useMemo(
    () => bankAccounts.find(ba => ba.id === Number(id)) ?? null,
    [bankAccounts, id],
  );

  const bankType = useMemo(() => bankAccount?.bankType ?? null, [bankAccount]);
  const bankAccountType = useMemo(
    () => bankAccount?.bankAccountType ?? null,
    [bankAccount],
  );

  const stats = useMemo(
    () => ({
      currentBalance: bankAccount?.startingBalance ?? 0,
      countSpent: '0',
      countIncome: '0',
      totalTransfers: '0',
    }),
    [bankAccount],
  );

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
    bankAccount,
    bankType,
    stats,
    formattedValues,
    handleSettingsPress,
    isNotFound: !bankAccount,
  };
};
