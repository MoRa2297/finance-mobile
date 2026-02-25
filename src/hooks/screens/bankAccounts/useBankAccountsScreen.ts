import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';

import { useBankAccountStore, bankAccountSelectors } from '@/stores';
import { BankAccount, SwipePickerMonth } from '@/types';
import { MonthItem } from '@components/screens/home';
import { theme } from '@config/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useBankAccountsScreen = () => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);
  const isLoading = useBankAccountStore(bankAccountSelectors.isLoading);
  const fetchBankAccounts = useBankAccountStore(
    state => state.fetchBankAccounts,
  );
  const deleteBankAccount = useBankAccountStore(
    state => state.deleteBankAccount,
  );

  // Local state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null,
  );

  // Fetch al mount
  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  // TODO: calcoli totali da reimplementare quando le transaction sono collegate
  const totSpent = 0;
  const totResidue = useMemo(
    () =>
      bankAccounts.reduce((acc, account) => acc + account.startingBalance, 0),
    [bankAccounts],
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

  const handleSelectMonth = useCallback((month: MonthItem) => {
    setSelectedDate(month.date);
  }, []);

  const handleAccountPress = useCallback(
    (account: BankAccount) => {
      router.push({
        pathname: '/(auth)/bank-accounts/bank-account-detail',
        params: { id: account.id },
      });
    },
    [router],
  );

  const handleOptionsPress = useCallback(
    (account: BankAccount) => {
      const options = [
        t('common:edit'),
        t('common:delete'),
        t('common:cancel'),
      ];

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          ...actionSheetStyles,
        },
        selectedIndex => {
          if (selectedIndex === 0) {
            router.push({
              pathname: '/(auth)/bank-accounts/bank-account-form',
              params: { id: account.id },
            });
          } else if (selectedIndex === 1) {
            setAccountToDelete(account);
            setAlertVisible(true);
          }
        },
      );
    },
    [t, showActionSheetWithOptions, router, actionSheetStyles],
  );

  const handleAddAccount = useCallback(() => {
    const options = [
      t('bankAccountPage:bankAccountActionSheet.createBankAccount'),
      t('common:cancel'),
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push('/(auth)/bank-accounts/bank-account-form');
        }
      },
    );
  }, [t, showActionSheetWithOptions, router, actionSheetStyles]);

  const handleDeleteConfirm = useCallback(async () => {
    if (accountToDelete) {
      await deleteBankAccount(accountToDelete.id);
      setAccountToDelete(null);
      setAlertVisible(false);
    }
  }, [accountToDelete, deleteBankAccount]);

  const handleDeleteCancel = useCallback(() => {
    setAccountToDelete(null);
    setAlertVisible(false);
  }, []);

  return {
    bankAccounts,
    isLoading,
    totSpent,
    totResidue,
    alertVisible,
    handleSelectMonth,
    handleAccountPress,
    handleOptionsPress,
    handleAddAccount,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
