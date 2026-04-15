import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import {
  BankAccount,
  BankCard,
  Category,
  Transaction,
  TransactionFormTypes,
} from '@/types';

interface SelectionState {
  bankAccount: BankAccount | null;
  category: Category | null;
  card: BankCard | null;
  toAccount: BankAccount | null;
}

interface UseTransactionSelectionProps {
  formType: TransactionFormTypes;
  isEditing: boolean;
  existingTransaction?: Transaction | null;
  bankAccounts: BankAccount[];
  cards: BankCard[];
  onError: (error: string | null) => void;
  onShowAlert: () => void;
}

export const useTransactionSelection = ({
  formType,
  isEditing,
  existingTransaction,
  bankAccounts,
  cards,
  onError,
  onShowAlert,
}: UseTransactionSelectionProps) => {
  const { t } = useTranslation('transactionPage');

  const isTransfer = formType === TransactionFormTypes.TRANSFER;

  const [selection, setSelection] = useState<SelectionState>({
    bankAccount: null,
    category: null,
    card: null,
    toAccount: null,
  });

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
      existingTransaction.type === TransactionFormTypes.TRANSFER &&
      existingTransaction.transferDetail
        ? (bankAccounts.find(
            ba => ba.id === existingTransaction.transferDetail?.toAccountId,
          ) ?? null)
        : null;

    setSelection({ bankAccount, card, category, toAccount });
  }, [existingTransaction, bankAccounts, cards]);

  // Reset selections on formType change — skip during edit
  useEffect(() => {
    if (isEditing) return;
    setSelection({
      bankAccount: null,
      category: null,
      card: null,
      toAccount: null,
    });
    onError(null);
  }, [formType, isEditing]);

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validateSelections = useCallback((): boolean => {
    if (isTransfer) {
      if (!selection.bankAccount) {
        onError(t('errors.fromAccountRequired'));
        return false;
      }
      if (!selection.toAccount) {
        onError(t('errors.toAccountRequired'));
        return false;
      }
      if (selection.bankAccount.id === selection.toAccount.id) {
        onError(t('errors.sameAccountError'));
        return false;
      }
    } else {
      if (!selection.bankAccount) {
        onError(t('errors.bankRequired'));
        return false;
      }
      if (!selection.category) {
        onError(t('errors.categoryRequired'));
        return false;
      }
    }
    onError(null);
    return true;
  }, [selection, isTransfer, t, onError]);

  // ─── Sheet handlers ───────────────────────────────────────────────────────────

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
      onError(null);
    }
  }, [formType, onError]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount) {
      setSelection(prev => ({
        ...prev,
        bankAccount: result.bankAccount,
        card: null,
      }));
      onError(null);
    }
  }, [onError]);

  const handleOpenToAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount) {
      setSelection(prev => ({ ...prev, toAccount: result.bankAccount }));
      onError(null);
    }
  }, [onError]);

  const handleOpenCardSheet = useCallback(async () => {
    if (!selection.bankAccount) {
      onError(t('errors.selectBankFirst'));
      onShowAlert();
      return;
    }
    const result = await SheetManager.show('select-card-sheet', {
      payload: { bankAccountIds: [selection.bankAccount.id] },
    });
    if (result?.item) {
      setSelection(prev => ({ ...prev, card: result.item }));
      onError(null);
    }
  }, [selection.bankAccount, t, onError, onShowAlert]);

  return {
    selection,
    validateSelections,
    handleOpenCategorySheet,
    handleOpenBankAccountSheet,
    handleOpenToAccountSheet,
    handleOpenCardSheet,
  };
};
