import { useState, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDataStore, useAuthStore } from '@/stores';
import { Transaction, EditTransaction } from '@/types';
import { theme } from '@/config/theme';
// TODO
// @ts-ignore
import { TransactionFormTypes } from '@types/Transaction';

export const useTransactionFormScreen = () => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{
    id?: string;
    type?: TransactionFormTypes;
  }>();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store data
  const user = useAuthStore(state => state.user);
  const transactions = useDataStore(state => state.transactions);
  const addTransaction = useDataStore(state => state.addTransaction);
  const updateTransaction = useDataStore(state => state.updateTransaction);

  // Find existing transaction if editing
  const existingTransaction = useMemo(() => {
    if (!id) return null;
    return transactions.find(t => t.id === Number(id)) || null;
  }, [transactions, id]);

  const isEditing = !!existingTransaction;

  // Local state
  const [formType, setFormType] = useState<TransactionFormTypes>(
    (existingTransaction?.type as TransactionFormTypes) ||
      type ||
      TransactionFormTypes.EXPENSE,
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handlers
  const handleOpenTypeSelector = useCallback(() => {
    const options = [
      t('transactionPage:types.income'),
      t('transactionPage:types.expense'),
      t('transactionPage:types.card_spending'),
      t('common:cancel'),
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 3,
        ...actionSheetStyles,
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            setFormType(TransactionFormTypes.INCOME);
            break;
          case 1:
            setFormType(TransactionFormTypes.EXPENSE);
            break;
          case 2:
            setFormType(TransactionFormTypes.CARD_SPENDING);
            break;
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles]);

  const handleSubmit = useCallback(
    async (values: EditTransaction) => {
      try {
        setIsSubmitting(true);
        setSubmitError(undefined);

        if (!user?.id) {
          throw new Error('User not found');
        }

        const transactionData: EditTransaction = {
          id: values.id,
          bankAccountId: values.bankAccountId,
          categoryId: values.categoryId,
          cardAccountId:
            formType === TransactionFormTypes.CARD_SPENDING
              ? values.cardAccountId
              : null,
          money: values.money,
          userId: user.id,
          date: values.date,
          description: values.description,
          note: values.note,
          recived: values.recived,
          recurrent: values.recurrent,
          repeat: values.repeat,
          type: formType,
        };

        if (isEditing && existingTransaction) {
          updateTransaction(transactionData);
        } else {
          addTransaction({
            id: Date.now(),
            bankAccountId: Number(transactionData.bankAccountId),
            categoryId: Number(transactionData.categoryId),
            cardId: transactionData.cardAccountId
              ? Number(transactionData.cardAccountId)
              : 0,
            money: String(transactionData.money),
            userId: Number(transactionData.userId),
            date: transactionData.date,
            description: transactionData.description,
            note: transactionData.note,
            recived: transactionData.recived,
            recurrent: transactionData.recurrent,
            repeat: transactionData.repeat,
            type: transactionData.type,
          });
        }

        router.back();
      } catch (error: any) {
        setSubmitError(t('common:errors.generic'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      user,
      formType,
      isEditing,
      existingTransaction,
      addTransaction,
      updateTransaction,
      router,
      t,
    ],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // Get form type label
  const formTypeLabel = useMemo(() => {
    return t(`transactionPage:types.${formType}`);
  }, [formType, t]);

  return {
    // Data
    existingTransaction,
    isEditing,
    formType,
    formTypeLabel,

    // State
    submitError,
    isSubmitting,

    // Handlers
    handleOpenTypeSelector,
    handleSubmit,
    handleCancel,
  };
};
