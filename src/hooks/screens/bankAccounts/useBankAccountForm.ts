import { useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SheetManager } from 'react-native-actions-sheet';

import {
  useBankAccountStore,
  bankAccountSelectors,
  useLookupStore,
  lookupSelectors,
} from '@/stores';
import { BankType, BankAccountType } from '@/types';

export interface BankAccountFormValues {
  name: string;
  startingBalance: string;
  color: string;
  bankType: BankType | null;
  accountType: BankAccountType | null;
}

export const useBankAccountForm = () => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  // Store
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);
  const createBankAccount = useBankAccountStore(
    state => state.createBankAccount,
  );
  const updateBankAccount = useBankAccountStore(
    state => state.updateBankAccount,
  );
  const colors = useLookupStore(lookupSelectors.colors);
  const bankTypes = useLookupStore(lookupSelectors.bankTypes);
  const bankAccountTypes = useLookupStore(lookupSelectors.bankAccountTypes);

  const existingAccount = useMemo(
    () => bankAccounts.find(ba => ba.id === Number(id)) ?? null,
    [bankAccounts, id],
  );

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t('bankAccountPage:alertNameError')),
    startingBalance: Yup.number()
      .typeError(t('bankAccountPage:alertStartingMoneyError'))
      .required(t('bankAccountPage:alertStartingMoneyError')),
    bankType: Yup.object()
      .nullable()
      .required(t('bankAccountPage:alertBankIDError')),
    accountType: Yup.object()
      .nullable()
      .required(t('bankAccountPage:alertTypeError')),
  });

  // Initial values
  const initialValues: BankAccountFormValues = useMemo(
    () => ({
      name: existingAccount?.name ?? '',
      startingBalance: existingAccount?.startingBalance?.toString() ?? '',
      color: existingAccount?.colorId
        ? (colors.find(c => c.id === existingAccount.colorId)?.hexCode ??
          colors[0]?.hexCode ??
          '')
        : (colors[0]?.hexCode ?? ''),
      bankType: existingAccount
        ? (bankTypes.find(bt => bt.id === existingAccount.bankTypeId) ?? null)
        : null,
      accountType: existingAccount
        ? (bankAccountTypes.find(
            bat => bat.id === existingAccount.bankAccountTypeId,
          ) ?? null)
        : null,
    }),
    [existingAccount, colors, bankTypes, bankAccountTypes],
  );

  const formik = useFormik<BankAccountFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      const colorData = colors.find(c => c.hexCode === values.color);

      const payload = {
        name: values.name.trim(),
        startingBalance: parseFloat(values.startingBalance),
        colorId: colorData?.id ?? colors[0]?.id ?? 1,
        bankTypeId: values.bankType!.id,
        bankAccountTypeId: values.accountType!.id,
      };

      if (isEditing && existingAccount) {
        await updateBankAccount(existingAccount.id, payload);
      } else {
        await createBankAccount(payload);
      }

      router.back();
    },
  });

  // Sheet handlers
  const handleOpenBankSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-select-sheet');
    if (result?.bank) formik.setFieldValue('bankType', result.bank);
  }, [formik]);

  const handleOpenAccountTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-type-sheet');
    if (result?.accountType)
      formik.setFieldValue('accountType', result.accountType);
  }, [formik]);

  // First error for alert
  const firstError = useMemo(() => {
    const errors = formik.errors;
    return (
      (errors.bankType as string) ||
      errors.name ||
      errors.startingBalance ||
      (errors.accountType as string) ||
      null
    );
  }, [formik.errors]);

  return {
    formik,
    isEditing,
    colors,
    firstError,
    handleOpenBankSheet,
    handleOpenAccountTypeSheet,
  };
};
