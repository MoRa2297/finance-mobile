import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useBankAccounts } from '@/stores/bank-account/bank-account.queries';
import { useCards } from '@/stores/card/card.queries';
import { useTransaction } from '@/stores/transaction/transaction.queries';
import {
  useCreateTransaction,
  useCreateTransfer,
  useUpdateTransaction,
  useUpdateTransfer,
} from '@/stores/transaction/transaction.mutations';
import { useUpdateRecurringRule } from '@/stores/recurring/recurring.mutations';
import { isCreateableType } from '@/utils/transaction.utils';
import { useActionSheetStyles } from '@/hooks';
import {
  buildRecurrenceFromTransaction,
  DATE_FORMAT,
  parseDate,
} from './helpers';

import {
  TransactionFormTypes,
  CreateTransactionPayload,
  CreateTransferPayload,
  BankAccount,
  BankCard,
  Category,
} from '@/types';
import { RecurrenceValues } from '@components/ui/RecurrenceSelector/RecurrenceSelector';

dayjs.extend(customParseFormat);

export interface TransactionFormValues {
  money: string;
  description: string;
  note: string;
  date: string;
  recurrence: RecurrenceValues;
}

interface SelectionState {
  bankAccount: BankAccount | null;
  category: Category | null;
  card: BankCard | null;
  toAccount: BankAccount | null;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useTransactionForm = () => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const router = useRouter();
  const { id, formType: type } = useLocalSearchParams<{
    id?: string;
    formType?: string;
  }>();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();

  // ─── Server data ─────────────────────────────────────────────────────────────

  const { data: bankAccounts = [] } = useBankAccounts();
  const { data: cards = [] } = useCards();
  const { data: existingTransaction } = useTransaction(id ? Number(id) : null);

  const isEditing = !!existingTransaction;
  const isTransfer = (ft: TransactionFormTypes) =>
    ft === TransactionFormTypes.TRANSFER;

  // ─── Mutations ───────────────────────────────────────────────────────────────

  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutateAsync: createTransfer, isPending: isCreatingTransfer } =
    useCreateTransfer();
  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();
  const { mutateAsync: updateTransfer, isPending: isUpdatingTransfer } =
    useUpdateTransfer();
  const { mutateAsync: updateRecurringRule, isPending: isUpdatingRecurring } =
    useUpdateRecurringRule();

  const isMutating =
    isCreating ||
    isCreatingTransfer ||
    isUpdating ||
    isUpdatingTransfer ||
    isUpdatingRecurring;

  // ─── Local state ─────────────────────────────────────────────────────────────

  const [formType, setFormType] = useState<TransactionFormTypes>(
    (type as TransactionFormTypes) ?? TransactionFormTypes.EXPENSE,
  );

  const [selection, setSelection] = useState<SelectionState>({
    bankAccount: null,
    category: null,
    card: null,
    toAccount: null,
  });

  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // Sync formType from existing transaction (edit mode)
  useEffect(() => {
    if (!existingTransaction) return;
    setFormType(existingTransaction.type as TransactionFormTypes);
  }, [existingTransaction]);

  // Populate selection from existing transaction (edit mode)
  useEffect(() => {
    if (!existingTransaction) return;

    const bankAccount =
      bankAccounts.find(ba => ba.id === existingTransaction.bankAccountId) ??
      null;
    const card =
      cards.find(c => c.id === existingTransaction.cardAccountId) ?? null;
    const category = existingTransaction.category ?? null;
    const toAccount =
      isTransfer(existingTransaction.type as TransactionFormTypes) &&
      existingTransaction.transferDetail
        ? (bankAccounts.find(
            ba => ba.id === existingTransaction.transferDetail?.toAccountId,
          ) ?? null)
        : null;

    console.log('existingTransaction', existingTransaction);
    console.log('cards', cards);
    console.log('card', card);

    setSelection({ bankAccount, card, category, toAccount });
  }, [existingTransaction, bankAccounts, cards]);

  // Reset selections on formType change — skip during edit to avoid
  // overwriting the selections populated by the effect above
  useEffect(() => {
    if (isEditing) return;
    setSelection({
      bankAccount: null,
      category: null,
      card: null,
      toAccount: null,
    });
    setSelectionError(null);
  }, [formType, isEditing]);

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

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const formik = useFormik<TransactionFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      const dateISO = parseDate(values.date);
      const recurrenceEndDate = values.recurrence.endDate
        ? parseDate(values.recurrence.endDate)
        : undefined;

      if (isTransfer(formType)) {
        const payload: CreateTransferPayload = {
          amount: parseFloat(values.money),
          date: dateISO,
          description: values.description.trim(),
          recurrent: values.recurrence.recurrent,
          frequency: values.recurrence.frequency ?? undefined,
          recurrenceEndDate,
          note: values.note,
          fromAccountId: selection.bankAccount?.id,
          toAccountId: selection.toAccount?.id,
          cardAccountId: selection.card?.id,
          categoryId: selection.category?.id,
        };

        if (isEditing && existingTransaction) {
          if (
            existingTransaction.recurrent &&
            existingTransaction.recurringRuleId
          ) {
            // Recurring transfer — update the rule only
            // Future transactions will be regenerated by the cron job
            await updateRecurringRule({
              id: existingTransaction.recurringRuleId,
              payload: {
                amount: parseFloat(values.money),
                description: values.description.trim(),
                frequency: values.recurrence.frequency ?? undefined,
                endDate: recurrenceEndDate,
                note: values.note,
                fromAccountId: selection.bankAccount?.id,
                toAccountId: selection.toAccount?.id,
              },
            });
          } else {
            // Single transfer — delete both legs and recreate atomically
            if (!existingTransaction.transferDetailId) {
              throw new Error(
                'transferDetailId not found on existing transaction',
              );
            }
            await updateTransfer({
              transferDetailId: existingTransaction.transferDetailId,
              payload,
            });
          }
        } else {
          await createTransfer(payload);
        }
      } else {
        if (!isCreateableType(formType)) return;

        const payload: CreateTransactionPayload = {
          amount: parseFloat(values.money),
          date: dateISO,
          description: values.description.trim(),
          recurrent: values.recurrence.recurrent,
          frequency: values.recurrence.frequency ?? undefined,
          recurrenceEndDate,
          note: values.note,
          type: formType,
          categoryId: selection.category?.id,
          bankAccountId: selection.bankAccount?.id,
          cardAccountId: selection.card?.id,
        };

        if (isEditing && existingTransaction) {
          await updateTransaction({ id: existingTransaction.id, payload });
        } else {
          await createTransaction(payload);
        }
      }

      router.back();
    },
  });

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validateSelections = useCallback((): boolean => {
    if (isTransfer(formType)) {
      if (!selection.bankAccount) {
        setSelectionError(t('transactionPage:errors.fromAccountRequired'));
        return false;
      }
      if (!selection.toAccount) {
        setSelectionError(t('transactionPage:errors.toAccountRequired'));
        return false;
      }
      if (selection.bankAccount.id === selection.toAccount.id) {
        setSelectionError(t('transactionPage:errors.sameAccountError'));
        return false;
      }
    } else {
      if (!selection.bankAccount) {
        setSelectionError(t('transactionPage:errors.bankRequired'));
        return false;
      }
      if (!selection.category) {
        setSelectionError(t('transactionPage:errors.categoryRequired'));
        return false;
      }
    }
    setSelectionError(null);
    return true;
  }, [selection, formType, t]);

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

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleCancel = useCallback(() => router.back(), [router]);

  const handleOpenTypeSelector = useCallback(() => {
    const options = [
      t('transactionPage:income'),
      t('transactionPage:expense'),
      t('transactionPage:transfer'),
      t('common:cancel'),
    ];
    showActionSheetWithOptions(
      { options, cancelButtonIndex: 3, ...actionSheetStyles },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            setFormType(TransactionFormTypes.INCOME);
            break;
          case 1:
            setFormType(TransactionFormTypes.EXPENSE);
            break;
          case 2:
            setFormType(TransactionFormTypes.TRANSFER);
            break;
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles]);

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

  const handleOpenCategorySheet = useCallback(async () => {
    const categoryType =
      formType === TransactionFormTypes.INCOME
        ? TransactionFormTypes.INCOME
        : TransactionFormTypes.EXPENSE;
    const result = await SheetManager.show('select-category-sheet', {
      payload: { type: categoryType },
    });
    if (result?.item) {
      setSelection(prev => ({ ...prev, category: result.item }));
      setSelectionError(null);
    }
  }, [formType]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount) {
      setSelection(prev => ({
        ...prev,
        bankAccount: result.bankAccount,
        card: null,
      }));
      setSelectionError(null);
    }
  }, []);

  const handleOpenToAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount) {
      setSelection(prev => ({ ...prev, toAccount: result.bankAccount }));
      setSelectionError(null);
    }
  }, []);

  const handleOpenCardSheet = useCallback(async () => {
    const bankAccountIds = selection.bankAccount
      ? [selection.bankAccount.id]
      : [];
    if (bankAccountIds.length === 0) {
      setSelectionError(t('transactionPage:errors.selectBankFirst'));
      setAlertVisible(true);
      return;
    }
    const result = await SheetManager.show('select-card-sheet', {
      payload: { bankAccountIds },
    });
    if (result?.item) {
      setSelection(prev => ({ ...prev, card: result.item }));
      setSelectionError(null);
    }
  }, [selection.bankAccount, t]);

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

  const formTypeLabel = useMemo(
    () => t(`transactionPage:${formType.toLowerCase()}`),
    [formType, t],
  );

  return {
    formik,
    formType,
    formTypeLabel,
    selection,
    isEditing,
    isSubmitting: isMutating || formik.isSubmitting,
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
