import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  useCreateTransaction,
  useCreateTransfer,
  useUpdateTransaction,
  useUpdateTransfer,
} from '@/stores/transaction/transaction.mutations';
import { useUpdateRecurringRule } from '@/stores/recurring/recurring.mutations';
import { isCreateableType } from '@/utils/transaction.utils';
import {
  Transaction,
  TransactionFormTypes,
  CreateTransactionPayload,
  CreateTransferPayload,
  BankAccount,
  BankCard,
  Category,
  Frequency,
} from '@/types';

interface SelectionState {
  bankAccount: BankAccount | null;
  category: Category | null;
  card: BankCard | null;
  toAccount: BankAccount | null;
}

interface UseTransactionMutationsProps {
  formType: TransactionFormTypes;
  selection: SelectionState;
  existingTransaction?: Transaction | null;
}

const parseDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export const useTransactionMutations = ({
  formType,
  selection,
  existingTransaction,
}: UseTransactionMutationsProps) => {
  const router = useRouter();
  const isEditing = !!existingTransaction;
  const isTransfer = formType === TransactionFormTypes.TRANSFER;

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

  const isPending =
    isCreating ||
    isCreatingTransfer ||
    isUpdating ||
    isUpdatingTransfer ||
    isUpdatingRecurring;

  const submit = useCallback(
    async (values: {
      money: string;
      date: string;
      description: string;
      note: string;
      recurrence: {
        recurrent: boolean;
        frequency?: Frequency | null;
        endDate?: string | null;
      };
    }) => {
      const dateISO = parseDate(values.date);
      const recurrenceEndDate = values.recurrence.endDate
        ? parseDate(values.recurrence.endDate)
        : undefined;

      if (isTransfer) {
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
    [
      isTransfer,
      isEditing,
      existingTransaction,
      formType,
      selection,
      createTransaction,
      createTransfer,
      updateTransaction,
      updateTransfer,
      updateRecurringRule,
      router,
    ],
  );

  return { submit, isPending };
};
