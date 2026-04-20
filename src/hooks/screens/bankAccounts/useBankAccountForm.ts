import { useState, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SheetManager } from 'react-native-actions-sheet';

import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import {
  useCreateBankAccount,
  useUpdateBankAccount,
} from '@/stores/bank-account/bank-account.mutations';
import { BankType, BankAccountType } from '@/types';
import { useBankAccountTypes, useBankTypes, useColors } from '@stores/lookup';

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

  const { data: colors = [] } = useColors();
  const { data: bankTypes = [] } = useBankTypes();
  const { data: bankAccountTypes = [] } = useBankAccountTypes();
  const { data: bankAccounts = [] } = useBankAccounts();
  const { mutateAsync: createBankAccount } = useCreateBankAccount();
  const { mutateAsync: updateBankAccount } = useUpdateBankAccount();

  const [alertVisible, setAlertVisible] = useState(false);

  const existingAccount = useMemo(
    () => bankAccounts.find(ba => ba.id === Number(id)) ?? null,
    [bankAccounts, id],
  );

  const initialValues: BankAccountFormValues = useMemo(
    () => ({
      name: existingAccount?.name ?? '',
      startingBalance: existingAccount?.startingBalance?.toString() ?? '',
      color: existingAccount?.colorId
        ? (colors.find((c: { id: number }) => c.id === existingAccount.colorId)
            ?.hexCode ??
          colors[0]?.hexCode ??
          '')
        : (colors[0]?.hexCode ?? ''),
      bankType: existingAccount
        ? (bankTypes.find(
            (bt: { id: number }) => bt.id === existingAccount.bankTypeId,
          ) ?? null)
        : null,
      accountType: existingAccount
        ? (bankAccountTypes.find(
            (bat: { id: number }) =>
              bat.id === existingAccount.bankAccountTypeId,
          ) ?? null)
        : null,
    }),
    [existingAccount, colors, bankTypes, bankAccountTypes],
  );

  const formik = useFormik<BankAccountFormValues>({
    initialValues,
    validationSchema: Yup.object({
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
    }),
    enableReinitialize: true,
    onSubmit: async values => {
      const colorData = colors.find(
        (c: { hexCode: string }) => c.hexCode === values.color,
      );
      const payload = {
        name: values.name.trim(),
        startingBalance: parseFloat(values.startingBalance),
        colorId: colorData?.id ?? colors[0]?.id ?? 1,
        bankTypeId: values.bankType!.id,
        bankAccountTypeId: values.accountType!.id,
      };

      if (isEditing && existingAccount) {
        await updateBankAccount({ id: existingAccount.id, payload });
      } else {
        await createBankAccount(payload);
      }
      router.back();
    },
  });

  const handleSubmit = useCallback(async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        name: true,
        startingBalance: true,
        bankType: true,
        accountType: true,
      });
      setAlertVisible(true);
      return;
    }
    formik.handleSubmit();
  }, [formik]);

  const handleOpenBankSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-select-sheet');
    if (result?.bank) formik.setFieldValue('bankType', result.bank);
  }, [formik.setFieldValue]);

  const handleOpenAccountTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-type-sheet');
    if (result?.accountType)
      formik.setFieldValue('accountType', result.accountType);
  }, [formik.setFieldValue]);

  const firstError = useMemo(() => {
    const { name, startingBalance, bankType, accountType } = formik.errors;
    return (
      (bankType as string) ||
      name ||
      startingBalance ||
      (accountType as string) ||
      null
    );
  }, [formik.errors]);

  return {
    formik,
    isEditing,
    colors,
    firstError,
    alertVisible,
    setAlertVisible,
    handleSubmit,
    handleOpenBankSheet,
    handleOpenAccountTypeSheet,
  };
};
