import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
  useTransactionStore,
  transactionSelectors,
  useBankAccountStore,
  bankAccountSelectors,
  useCardStore,
  cardSelectors,
} from '@/stores';
import {
  TransactionFormTypes,
  CreateTransactionPayload,
  CreateTransferPayload,
  BankAccount,
  BankCard,
  Category,
} from '@/types';
import { theme } from '@config/theme';
import { RecurrenceValues } from '@components/ui/RecurrenceSelector/RecurrenceSelector';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD-MM-YYYY';

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
  toAccount: BankAccount | null; // only for TRANSFER
}

export const useTransactionForm = () => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, formType: type } = useLocalSearchParams<{
    id?: string;
    formType?: string;
  }>();
  const { showActionSheetWithOptions } = useActionSheet();

  const transactions = useTransactionStore(transactionSelectors.transactions);
  const createTransaction = useTransactionStore(
    state => state.createTransaction,
  );
  const createTransfer = useTransactionStore(state => state.createTransfer);
  const updateTransaction = useTransactionStore(
    state => state.updateTransaction,
  );
  const isMutating = useTransactionStore(transactionSelectors.isMutating);
  const bankAccounts = useBankAccountStore(bankAccountSelectors.bankAccounts);
  const cards = useCardStore(cardSelectors.cards);

  const existingTransaction = useMemo(
    () => transactions.find(t => t.id === Number(id)) ?? null,
    [transactions, id],
  );

  const isEditing = !!existingTransaction;
  const isTransfer = (ft: TransactionFormTypes) =>
    ft === TransactionFormTypes.TRANSFER;

  const [formType, setFormType] = useState<TransactionFormTypes>(
    (existingTransaction?.type as TransactionFormTypes) ||
      (type as TransactionFormTypes) ||
      TransactionFormTypes.EXPENSE,
  );

  const [selection, setSelection] = useState<SelectionState>({
    bankAccount: null,
    category: null,
    card: null,
    toAccount: null,
  });

  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // Init selection from existing transaction
  useEffect(() => {
    if (!existingTransaction) return;
    const bankAccount = bankAccounts.find(
      ba => ba.id === existingTransaction.bankAccountId,
    );
    const card = cards.find(c => c.id === existingTransaction.cardAccountId);
    setSelection(prev => ({
      ...prev,
      bankAccount: bankAccount ?? null,
      card: card ?? null,
    }));
  }, [existingTransaction, bankAccounts, cards]);

  // Reset selections incompatibili quando cambia formType
  useEffect(() => {
    setSelection({
      bankAccount: null,
      category: null,
      card: null,
      toAccount: null,
    });
    setSelectionError(null);
  }, [formType]);

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
      textStyle: { textAlign: 'center' as const, color: theme.colors.basic100 },
    }),
    [insets.bottom],
  );

  const validationSchema = Yup.object({
    money: Yup.number()
      .typeError(t('transactionPage:errors.moneyRequired'))
      .moreThan(0, t('transactionPage:errors.moneyRequired'))
      .required(t('transactionPage:errors.moneyRequired')),
    description: Yup.string()
      .trim()
      .required(t('transactionPage:errors.descriptionRequired')),
    date: Yup.string().required(t('transactionPage:errors.dateRequired')),
  });

  const initialValues: TransactionFormValues = useMemo(
    () => ({
      money: existingTransaction?.money?.toString() ?? '',
      description: existingTransaction?.description ?? '',
      note: existingTransaction?.note ?? '',
      date: existingTransaction?.date
        ? dayjs(existingTransaction.date).format(DATE_FORMAT)
        : dayjs().format(DATE_FORMAT),
      recurrence: {
        recurrent: existingTransaction?.recurrent ?? false,
        frequency: null,
        interval: '1',
        endDate: null,
      },
    }),
    [existingTransaction],
  );

  const formik = useFormik<TransactionFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      const [day, month, year] = values.date.split('-');
      const dateISO = new Date(`${year}-${month}-${day}`).toISOString();

      if (isTransfer(formType)) {
        // In onSubmit, nel branch non-transfer
        const payload: CreateTransactionPayload = {
          money: parseFloat(values.money),
          date: dateISO,
          description: values.description.trim(),
          recurrent: values.recurrence.recurrent,
          frequency: values.recurrence.frequency ?? undefined,
          recurrenceEndDate: values.recurrence.endDate
            ? (() => {
                const [day, month, year] =
                  values.recurrence.endDate!.split('-');
                return new Date(`${year}-${month}-${day}`).toISOString();
              })()
            : undefined,
          note: values.note,
          type: formType,
          categoryId: selection.category?.id,
          bankAccountId: selection.bankAccount?.id,
          cardAccountId: selection.card?.id,
        };
        // await createTransfer(payload);
      } else {
        const payload: CreateTransactionPayload = {
          money: parseFloat(values.money),
          date: dateISO,
          description: values.description.trim(),
          recurrent: values.recurrence.recurrent,
          note: values.note,
          type: formType,
          categoryId: selection.category?.id,
          bankAccountId: selection.bankAccount?.id,
          cardAccountId: selection.card?.id,
        };

        if (isEditing && existingTransaction) {
          await updateTransaction(existingTransaction.id, payload);
        } else {
          await createTransaction(payload);
        }
      }

      router.back();
    },
  });

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
