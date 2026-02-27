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
  BankAccount,
  BankCard,
  Category,
} from '@/types';
import { theme } from '@config/theme';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD-MM-YYYY';

export interface TransactionFormValues {
  money: string;
  description: string;
  note: string;
  date: string;
  recived: boolean;
  recurrent: boolean;
  repeat: boolean;
}

interface SelectionState {
  bankAccount: BankAccount | null;
  category: Category | null;
  card: BankCard | null;
}

export const useTransactionForm = () => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id?: string; type?: string }>();
  const { showActionSheetWithOptions } = useActionSheet();

  const transactions = useTransactionStore(transactionSelectors.transactions);
  const createTransaction = useTransactionStore(
    state => state.createTransaction,
  );
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

  const [formType, setFormType] = useState<TransactionFormTypes>(
    (existingTransaction?.type as TransactionFormTypes) ||
      (type as TransactionFormTypes) ||
      TransactionFormTypes.EXPENSE,
  );

  const [selection, setSelection] = useState<SelectionState>({
    bankAccount: null,
    category: null,
    card: null,
  });

  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const isCardExpense = formType === TransactionFormTypes.CARD_EXPENSE;

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
      recived: existingTransaction?.recived ?? false,
      recurrent: existingTransaction?.recurrent ?? false,
      repeat: existingTransaction?.repeat ?? false,
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

      const payload: CreateTransactionPayload = {
        money: parseFloat(values.money),
        recived: values.recived,
        date: dateISO,
        description: values.description.trim(),
        recurrent: values.recurrent,
        repeat: values.repeat,
        note: values.note,
        type: formType,
        categoryId: selection.category!.id,
        bankAccountId: selection.bankAccount?.id,
        cardAccountId: selection.card?.id ?? null,
      };

      if (isEditing && existingTransaction) {
        await updateTransaction(existingTransaction.id, payload);
      } else {
        await createTransaction(payload);
      }

      router.back();
    },
  });

  const bankAccountIdsForCards = useMemo(() => {
    if (isCardExpense) return bankAccounts.map(ba => ba.id);
    return selection.bankAccount ? [selection.bankAccount.id] : [];
  }, [isCardExpense, bankAccounts, selection.bankAccount]);

  const validateSelections = useCallback((): boolean => {
    if (!isCardExpense && !selection.bankAccount) {
      setSelectionError(t('transactionPage:errors.bankRequired'));
      return false;
    }
    if (isCardExpense && !selection.card) {
      setSelectionError(t('transactionPage:errors.cardRequired'));
      return false;
    }
    if (!selection.category) {
      setSelectionError(t('transactionPage:errors.categoryRequired'));
      return false;
    }
    setSelectionError(null);
    return true;
  }, [selection, isCardExpense, t]);

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
      t('transactionPage:card_expense'),
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
            setFormType(TransactionFormTypes.CARD_EXPENSE);
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
      formType === TransactionFormTypes.INCOME ? 'income' : 'expense';
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

  const handleOpenCardSheet = useCallback(async () => {
    if (bankAccountIdsForCards.length === 0) {
      setSelectionError(t('transactionPage:errors.selectBankFirst'));
      setAlertVisible(true);
      return;
    }
    const result = await SheetManager.show('select-card-sheet', {
      payload: { bankAccountIds: bankAccountIdsForCards },
    });
    if (result?.item) {
      if (isCardExpense) {
        const cardBankAccount = bankAccounts.find(
          ba => ba.id === result.item.bankAccountId,
        );
        setSelection(prev => ({
          ...prev,
          card: result.item,
          bankAccount: cardBankAccount ?? prev.bankAccount,
        }));
      } else {
        setSelection(prev => ({ ...prev, card: result.item }));
      }
      setSelectionError(null);
    }
  }, [bankAccountIdsForCards, bankAccounts, isCardExpense, t]);

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
    () => t(`transactionPage:${formType}`),
    [formType, t],
  );

  return {
    // Form
    formik,
    formType,
    formTypeLabel,
    selection,
    isCardExpense,
    isEditing,
    isSubmitting: isMutating || formik.isSubmitting,

    // Alert
    alertVisible,
    firstError,
    setAlertVisible,

    // Handlers
    handleSubmit,
    handleCancel,
    handleOpenTypeSelector,
    handleOpenDatePicker,
    handleOpenCategorySheet,
    handleOpenBankAccountSheet,
    handleOpenCardSheet,
  };
};
