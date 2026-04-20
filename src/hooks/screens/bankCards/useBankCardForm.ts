import { useState, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SheetManager } from 'react-native-actions-sheet';

import { useCards } from '@/stores/card/card.queries';
import { useCreateCard, useUpdateCard } from '@/stores/card/card.mutations';
import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import { CardType, BankAccount } from '@/types';
import { MONTH_NUMBER, YEARS_NUMBER } from '@/config/constants';
import { useCardTypes } from '@stores/lookup';

export interface BankCardFormValues {
  name: string;
  cardLimit: string;
  monthExpiry: number;
  yearExpiry: number;
  cardType: CardType | null;
  bankAccount: BankAccount | null;
}

export const useBankCardForm = () => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: cardTypes = [] } = useCardTypes();
  const { data: cards = [] } = useCards();
  const { data: bankAccounts = [] } = useBankAccounts();
  const { mutateAsync: createCard } = useCreateCard();
  const { mutateAsync: updateCard } = useUpdateCard();

  const [alertVisible, setAlertVisible] = useState(false);

  const existingCard = useMemo(
    () => cards.find(c => c.id === Number(id)) ?? null,
    [cards, id],
  );

  const initialValues: BankCardFormValues = useMemo(
    () => ({
      name: existingCard?.name ?? '',
      cardLimit: existingCard?.cardLimit?.toString() ?? '',
      monthExpiry: existingCard?.monthExpiry ?? MONTH_NUMBER[0].id,
      yearExpiry: existingCard?.yearExpiry ?? Number(YEARS_NUMBER[0].name),
      cardType: existingCard
        ? (cardTypes.find(ct => ct.id === existingCard.cardTypeId) ?? null)
        : null,
      bankAccount: existingCard
        ? (bankAccounts.find(ba => ba.id === existingCard.bankAccountId) ??
          null)
        : null,
    }),
    [existingCard, cardTypes, bankAccounts],
  );

  const formik = useFormik<BankCardFormValues>({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().trim().required(t('bankCardsPage:alertNameError')),
      cardLimit: Yup.number()
        .typeError(t('bankCardsPage:alertCardLimitError'))
        .required(t('bankCardsPage:alertCardLimitError')),
      cardType: Yup.object()
        .nullable()
        .required(t('bankCardsPage:alertTypeError')),
      bankAccount: Yup.object()
        .nullable()
        .required(t('bankCardsPage:alertBankAccountIdError')),
    }),
    enableReinitialize: true,
    onSubmit: async values => {
      const payload = {
        name: values.name.trim(),
        cardLimit: parseFloat(values.cardLimit),
        monthExpiry: values.monthExpiry,
        yearExpiry: values.yearExpiry,
        cardTypeId: values.cardType!.id,
        bankAccountId: values.bankAccount!.id,
      };

      if (isEditing && existingCard) {
        await updateCard({ id: existingCard.id, payload });
      } else {
        await createCard(payload);
      }
      router.back();
    },
  });

  const handleSubmit = useCallback(async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        name: true,
        cardLimit: true,
        cardType: true,
        bankAccount: true,
      });
      setAlertVisible(true);
      return;
    }
    formik.handleSubmit();
  }, [formik]);

  const handleOpenCardTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('card-type-select-sheet');
    if (result?.cardType) formik.setFieldValue('cardType', result.cardType);
  }, [formik.setFieldValue]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount)
      formik.setFieldValue('bankAccount', result.bankAccount);
  }, [formik.setFieldValue]);

  const handleOpenMonthPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: MONTH_NUMBER },
    });
    if (result?.item?.name)
      formik.setFieldValue('monthExpiry', Number(result.item.name));
  }, [formik.setFieldValue]);

  const handleOpenYearPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: YEARS_NUMBER },
    });
    if (result?.item?.name)
      formik.setFieldValue('yearExpiry', Number(result.item.name));
  }, [formik.setFieldValue]);

  const firstError = useMemo(() => {
    const { name, cardLimit, cardType, bankAccount } = formik.errors;
    return (
      (bankAccount as string) ||
      name ||
      cardLimit ||
      (cardType as string) ||
      null
    );
  }, [formik.errors]);

  return {
    formik,
    isEditing,
    firstError,
    alertVisible,
    setAlertVisible,
    handleSubmit,
    handleOpenCardTypeSheet,
    handleOpenBankAccountSheet,
    handleOpenMonthPicker,
    handleOpenYearPicker,
  };
};
