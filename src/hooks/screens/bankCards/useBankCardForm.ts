import { useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SheetManager } from 'react-native-actions-sheet';

import {
  useCardStore,
  cardSelectors,
  useBankAccountStore,
  bankAccountSelectors,
  useLookupStore,
  lookupSelectors,
} from '@/stores';
import { CardType, BankAccount } from '@/types';
import { MONTH_NUMBER, YEARS_NUMBER } from '@/config/constants';

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

  // Stores
  const cards = useCardStore(cardSelectors.cards);
  const createCard = useCardStore(state => state.createCard);
  const updateCard = useCardStore(state => state.updateCard);
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);
  const cardTypes = useLookupStore(lookupSelectors.cardTypes);

  const existingCard = useMemo(
    () => cards.find(c => c.id === Number(id)) ?? null,
    [cards, id],
  );

  const validationSchema = Yup.object({
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
  });

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
    validationSchema,
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
        await updateCard(existingCard.id, payload);
      } else {
        await createCard(payload);
      }

      router.back();
    },
  });

  const handleOpenCardTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('card-type-select-sheet');
    if (result?.cardType) formik.setFieldValue('cardType', result.cardType);
  }, [formik]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount)
      formik.setFieldValue('bankAccount', result.bankAccount);
  }, [formik]);

  const handleOpenMonthPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: MONTH_NUMBER },
    });
    if (result?.item?.name) {
      formik.setFieldValue('monthExpiry', Number(result.item.name));
    }
  }, [formik]);

  const handleOpenYearPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: YEARS_NUMBER },
    });
    if (result?.item?.name) {
      formik.setFieldValue('yearExpiry', Number(result.item.name));
    }
  }, [formik]);

  const firstError = useMemo(() => {
    const errors = formik.errors;
    return (
      (errors.bankAccount as string) ||
      errors.name ||
      errors.cardLimit ||
      (errors.cardType as string) ||
      null
    );
  }, [formik.errors]);

  return {
    formik,
    isEditing,
    firstError,
    handleOpenCardTypeSheet,
    handleOpenBankAccountSheet,
    handleOpenMonthPicker,
    handleOpenYearPicker,
  };
};
