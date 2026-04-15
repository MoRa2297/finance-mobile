import { useState, useCallback, useEffect } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { useActionSheetStyles } from '@/hooks';
import { TransactionFormTypes } from '@/types';

interface UseTransactionTypeProps {
  initialType?: TransactionFormTypes;
  isEditing: boolean;
  existingType?: TransactionFormTypes;
}

export const useTransactionType = ({
  initialType,
  isEditing,
  existingType,
}: UseTransactionTypeProps) => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();

  const [formType, setFormType] = useState<TransactionFormTypes>(
    initialType ?? TransactionFormTypes.EXPENSE,
  );

  // Sync formType from existing transaction in edit mode
  useEffect(() => {
    if (!existingType) return;
    setFormType(existingType);
  }, [existingType]);

  const formTypeLabel = t(`transactionPage:${formType.toLowerCase()}`);

  const handleOpenTypeSelector = useCallback(() => {
    if (isEditing) return; // Cannot change type in edit mode
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
  }, [t, showActionSheetWithOptions, actionSheetStyles, isEditing]);

  return {
    formType,
    formTypeLabel,
    handleOpenTypeSelector,
  };
};
