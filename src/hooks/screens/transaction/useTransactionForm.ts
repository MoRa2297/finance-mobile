import { useState, useMemo, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import { useCards } from '@/stores/card/card.queries';
import { useTransaction } from '@/stores/transaction/transaction.queries';
import { TransactionFormTypes } from '@/types';
import { RecurrenceValues } from '@components/ui/RecurrenceSelector/RecurrenceSelector';
import { buildRecurrenceFromTransaction } from './helpers';

import { useTransactionType } from './useTransactionType';
import { useTransactionSelection } from './useTransactionSelection';
import { useTransactionMutations } from './useTransactionMutations';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD-MM-YYYY';

export interface TransactionFormValues {
  money: string;
  description: string;
  note: string;
  date: string;
  recurrence: RecurrenceValues;
}

export const useTransactionForm = () => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const router = useRouter();
  const { id, formType: type } = useLocalSearchParams<{
    id?: string;
    formType?: string;
  }>();

  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // ─── Server data ─────────────────────────────────────────────────────────────

  const { data: bankAccounts = [] } = useBankAccounts();
  const { data: cards = [] } = useCards();
  const { data: existingTransaction } = useTransaction(id ? Number(id) : null);
  const isEditing = !!existingTransaction;

  // ─── Sub-hooks ───────────────────────────────────────────────────────────────

  const { formType, formTypeLabel, handleOpenTypeSelector } =
    useTransactionType({
      initialType: type as TransactionFormTypes,
      isEditing,
      existingType: existingTransaction?.type as TransactionFormTypes,
    });

  const {
    selection,
    validateSelections,
    handleOpenCategorySheet,
    handleOpenBankAccountSheet,
    handleOpenToAccountSheet,
    handleOpenCardSheet,
  } = useTransactionSelection({
    formType,
    isEditing,
    existingTransaction,
    bankAccounts,
    cards,
    onError: setSelectionError,
    onShowAlert: () => setAlertVisible(true),
  });

  const { submit, isPending } = useTransactionMutations({
    formType,
    selection,
    existingTransaction,
  });

  // ─── Form ────────────────────────────────────────────────────────────────────

  const validationSchema = useMemo(
    () =>
      Yup.object({
        money: Yup.number()
          .typeError(t('transactionPage:errors.moneyRequired'))
          .moreThan(0, t('transactionPage:errors.moneyRequired'))
          .required(t('transactionPage:errors.moneyRequired')),
        description: Yup.string()
          .trim()
          .required(t('transactionPage:errors.descriptionRequired')),
        date: Yup.string().required(t('transactionPage:errors.dateRequired')),
      }),
    [t],
  );

  const initialValues: TransactionFormValues = useMemo(
    () => ({
      money: existingTransaction?.amount?.toString() ?? '',
      description: existingTransaction?.description ?? '',
      note: existingTransaction?.note ?? '',
      date: existingTransaction?.date
        ? dayjs(existingTransaction.date).format(DATE_FORMAT)
        : dayjs().format(DATE_FORMAT),
      recurrence: existingTransaction
        ? buildRecurrenceFromTransaction(existingTransaction)
        : { recurrent: false, frequency: null, endDate: null },
    }),
    [existingTransaction],
  );

  const formik = useFormik<TransactionFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: submit,
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleOpenDatePicker = useCallback(async () => {
    const prevDate = dayjs(formik.values.date, DATE_FORMAT);
    const result = await SheetManager.show('date-picker-sheet', {
      payload: {
        day: String(prevDate.date()),
        month: String(prevDate.month() + 1),
        year: String(prevDate.year()),
      },
    });
    if (result) {
      const newDate = dayjs()
        .year(parseInt(result.year))
        .month(parseInt(result.month) - 1)
        .date(parseInt(result.day))
        .format(DATE_FORMAT);
      formik.setFieldValue('date', newDate);
    }
  }, [formik]);

  const handleSubmit = useCallback(async () => {
    const formErrors = await formik.validateForm();
    formik.setTouched({ money: true, description: true, date: true });
    const selectionsValid = validateSelections();

    if (Object.keys(formErrors).length > 0 || !selectionsValid) {
      setAlertVisible(true);
      return;
    }

    formik.handleSubmit();
  }, [formik, validateSelections]);

  const handleCancel = useCallback(() => router.back(), [router]);

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const firstError = useMemo(
    () =>
      selectionError ||
      formik.errors.money ||
      formik.errors.description ||
      formik.errors.date ||
      null,
    [selectionError, formik.errors],
  );

  return {
    formik,
    formType,
    formTypeLabel,
    selection,
    isEditing,
    isSubmitting: isPending || formik.isSubmitting,
    alertVisible,
    firstError,
    setAlertVisible,
    handleSubmit,
    handleCancel,
    handleOpenTypeSelector,
    handleOpenDatePicker,
    handleOpenCategorySheet,
    handleOpenBankAccountSheet,
    handleOpenToAccountSheet,
    handleOpenCardSheet,
  };
};
