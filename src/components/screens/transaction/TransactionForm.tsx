import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import {
  Transaction,
  BankAccount,
  BankCard,
  Category,
  EditTransaction,
} from '@/types';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { DateInputField } from '@components/ui/DateInputField';
import { SwitchInput } from '@components/ui/SwitchInput';

dayjs.extend(customParseFormat);

type TransactionType = 'income' | 'expense' | 'card_spending';

interface TransactionFormProps {
  formType: TransactionType;
  transaction: Transaction | null;
  onSubmit: (values: EditTransaction) => void;
  submitError?: string;
  isSubmitting?: boolean;
}

interface FormState {
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
  bankImageUrl: string | null;
  category: Category | null;
  card: BankCard | null;
}

const DATE_FORMAT = 'DD-MM-YYYY';

const getInitialFormState = (transaction: Transaction | null): FormState => ({
  money: transaction?.money || '',
  description: transaction?.description || '',
  note: transaction?.note || '',
  date: transaction?.date
    ? dayjs(transaction.date).format(DATE_FORMAT)
    : dayjs().format(DATE_FORMAT),
  recived: transaction?.recived || false,
  recurrent: transaction?.recurrent || false,
  repeat: transaction?.repeat || false,
});

const getInitialSelectionState = (): SelectionState => ({
  bankAccount: null,
  bankImageUrl: null,
  category: null,
  card: null,
});

const getCategoryType = (formType: TransactionType): 'income' | 'expenses' => {
  return formType === 'income' ? 'income' : 'expenses';
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  formType,
  transaction,
  onSubmit,
  submitError,
  isSubmitting = false,
}) => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankCards = useDataStore(state => state.bankCards);
  const bankTypes = useDataStore(state => state.bankTypes);
  const categories = useDataStore(state => state.categories);

  const [formState, setFormState] = useState<FormState>(() =>
    getInitialFormState(transaction),
  );

  const [selection, setSelection] = useState<SelectionState>(
    getInitialSelectionState,
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const isCardSpending = formType === 'card_spending';

  // Get bank account IDs for card selection
  // - For card_spending: use all accounts (user selects card first)
  // - For other types: use selected bank account only
  const bankAccountIdsForCards = useMemo(() => {
    if (isCardSpending) {
      return bankAccounts.map(ba => ba.id);
    }
    return selection.bankAccount ? [selection.bankAccount.id] : [];
  }, [isCardSpending, bankAccounts, selection.bankAccount]);

  const hasSelectedBankForCard =
    isCardSpending || selection.bankAccount !== null;

  const updateFormField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormState(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  const updateSelection = useCallback(
    <K extends keyof SelectionState>(field: K, value: SelectionState[K]) => {
      setSelection(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  const showAlert = useCallback((message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  useEffect(() => {
    if (!transaction) return;

    // Reset form state
    setFormState(getInitialFormState(transaction));

    // Bank account
    const bankAccount = bankAccounts.find(
      ba => ba.id === transaction.bankAccountId,
    );

    if (bankAccount) {
      const bankType = bankTypes.find(bt => bt.id === bankAccount.bankTypeId);

      setSelection(prev => ({
        ...prev,
        bankAccount,
        bankImageUrl: bankType?.imageUrl || null,
      }));
    }

    // Category
    const category = categories.find(c => c.id === transaction.categoryId);
    if (category) {
      updateSelection('category', category);
    }

    // Card
    const card = bankCards.find(c => c.id === transaction.cardId);
    if (card) {
      updateSelection('card', card);
    }
  }, [
    transaction,
    bankAccounts,
    bankTypes,
    categories,
    bankCards,
    updateSelection,
  ]);

  // Show submit error
  useEffect(() => {
    if (submitError) {
      showAlert(submitError);
    }
  }, [submitError, showAlert]);

  const handleOpenDatePicker = useCallback(async () => {
    const prevDate = dayjs(formState.date, DATE_FORMAT);

    const result = await SheetManager.show('date-picker-sheet', {
      payload: {
        day: String(prevDate.date()),
        month: String(prevDate.month() + 1),
        year: String(prevDate.year()),
      },
    });

    if (result) {
      const newDate = dayjs()
        .year(parseInt(result.year, 10))
        .month(parseInt(result.month, 10) - 1)
        .date(parseInt(result.day, 10))
        .format(DATE_FORMAT);

      updateFormField('date', newDate);
    }
  }, [formState.date, updateFormField]);

  const handleOpenCategorySheet = useCallback(async () => {
    const categoryType = getCategoryType(formType);

    const result = await SheetManager.show('select-category-sheet', {
      payload: { type: categoryType },
    });

    if (result?.item) {
      updateSelection('category', result.item);
    }
  }, [formType, updateSelection]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');

    if (result?.bankAccount) {
      const bankAccount = result.bankAccount;
      const bankType = bankTypes.find(bt => bt.id === bankAccount.bankTypeId);

      setSelection(prev => ({
        ...prev,
        bankAccount,
        bankImageUrl: bankType?.imageUrl || null,
        // Reset card when bank account changes (card might not belong to new account)
        card: null,
      }));
    }
  }, [bankTypes]);

  const handleOpenCardSheet = useCallback(async () => {
    // Don't open if no bank accounts available for card selection
    if (bankAccountIdsForCards.length === 0) {
      showAlert(t('transactionPage:errors.selectBankFirst'));
      return;
    }

    const result = await SheetManager.show('select-card-sheet', {
      payload: { bankAccountIds: bankAccountIdsForCards },
    });

    if (result?.item) {
      updateSelection('card', result.item);

      // For card_spending: auto-select the bank account of the selected card
      if (isCardSpending) {
        const cardBankAccount = bankAccounts.find(
          ba => ba.id === result.item.bankAccountId,
        );

        if (cardBankAccount) {
          const bankType = bankTypes.find(
            bt => bt.id === cardBankAccount.bankTypeId,
          );

          setSelection(prev => ({
            ...prev,
            bankAccount: cardBankAccount,
            bankImageUrl: bankType?.imageUrl || null,
            card: result.item,
          }));
        }
      }
    }
  }, [
    bankAccountIdsForCards,
    bankAccounts,
    bankTypes,
    isCardSpending,
    showAlert,
    updateSelection,
    t,
  ]);

  const validateForm = useCallback((): boolean => {
    // Bank account required (except for card_spending where it's auto-selected)
    if (!isCardSpending && !selection.bankAccount) {
      showAlert(t('transactionPage:errors.bankRequired'));
      return false;
    }

    // Card required for card_spending
    if (isCardSpending && !selection.card) {
      showAlert(t('transactionPage:errors.cardRequired'));
      return false;
    }

    // Category required
    if (!selection.category) {
      showAlert(t('transactionPage:errors.categoryRequired'));
      return false;
    }

    // Money required
    if (!formState.money || formState.money === '0') {
      showAlert(t('transactionPage:errors.moneyRequired'));
      return false;
    }

    // Date required
    if (!formState.date) {
      showAlert(t('transactionPage:errors.dateRequired'));
      return false;
    }

    // Description required
    if (!formState.description.trim()) {
      showAlert(t('transactionPage:errors.descriptionRequired'));
      return false;
    }

    return true;
  }, [formState, selection, isCardSpending, showAlert, t]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    // const values: EditTransaction = {
    //   id: transaction?.id,
    //   bankAccountId: selection.bankAccount!.id,
    //   cardId: selection.card?.id || null,
    //   categoryId: selection.category!.id,
    //   money: formState.money,
    //   recived: formState.recived,
    //   date: formState.date,
    //   description: formState.description.trim(),
    //   recurrent: formState.recurrent,
    //   repeat: formState.repeat,
    //   note: formState.note,
    //   type: formType,
    // };
    //
    // onSubmit(values);
  }, [
    isSubmitting,
    validateForm,
    formState,
    selection,
    formType,
    transaction?.id,
    onSubmit,
  ]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Top Section - Money Input */}
        <View style={styles.topSection}>
          <Text category="p2" style={styles.moneyLabel}>
            {t(`transactionPage:moneyValueTypes.${formType}`)}
          </Text>
          <InputIconField
            placeholder={t('transactionPage:moneyValuePlaceholder')}
            value={formState.money}
            onChange={value => updateFormField('money', value)}
            keyboardType="numeric"
            borderBottom={false}
            editable={!isSubmitting}
          />
        </View>

        {/* Bottom Section - Form Fields */}
        <View style={styles.bottomSection}>
          <View style={styles.inputsContainer}>
            {/* Received Switch */}
            {!isCardSpending && (
              <SwitchInput
                placeholder={t('transactionPage:recivedPlaceholder')}
                value={formState.recived}
                iconName="checkmark-circle-outline"
                onValueChange={value => updateFormField('recived', value)}
                disabled={isSubmitting}
              />
            )}

            {/* Date */}
            <DateInputField
              value={formState.date}
              iconName="calendar-outline"
              placeholder={t('transactionPage:datePlaceholder')}
              onPress={handleOpenDatePicker}
            />

            {/* Description */}
            <InputIconField
              placeholder={t('transactionPage:descriptionPlaceholder')}
              value={formState.description}
              onChange={value => updateFormField('description', value)}
              iconName="edit-outline"
              editable={!isSubmitting}
            />

            {/* Category */}
            <SelectInput
              placeholder={t('transactionPage:categoryPlaceholder')}
              value={selection.category?.name}
              iconName="bookmark-outline"
              selectedBorderColor={selection.category?.categoryColor?.hexCode}
              valueBordered
              onPress={handleOpenCategorySheet}
            />

            {/* Bank Account (not for card_spending - auto-selected from card) */}
            {!isCardSpending && (
              <SelectInput
                placeholder={t('transactionPage:bankPlaceholder')}
                value={selection.bankAccount?.name}
                iconName="grid-outline"
                selectedBorderColor={theme.colors.textHint}
                valueBordered
                onPress={handleOpenBankAccountSheet}
              />
            )}

            {/* Card Selection */}
            {(isCardSpending || selection.bankAccount) && (
              <SelectInput
                placeholder={t('transactionPage:cardPlaceholder')}
                value={selection.card?.name}
                iconName="credit-card-outline"
                selectedBorderColor={theme.colors.textHint}
                valueBordered
                onPress={handleOpenCardSheet}
              />
            )}

            {/* Recurrent Switch */}
            <SwitchInput
              placeholder={t('transactionPage:recurrentPlaceholder')}
              value={formState.recurrent}
              iconName="sync-outline"
              onValueChange={value => updateFormField('recurrent', value)}
              disabled={isSubmitting}
            />

            {/* Repeat Switch */}
            <SwitchInput
              placeholder={t('transactionPage:repeatPlaceholder')}
              value={formState.repeat}
              iconName="repeat-outline"
              onValueChange={value => updateFormField('repeat', value)}
              disabled={isSubmitting}
            />

            {/* Note */}
            <InputIconField
              placeholder={t('transactionPage:notePlaceholder')}
              value={formState.note}
              onChange={value => updateFormField('note', value)}
              iconName="edit-outline"
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <View
            style={[
              styles.buttonContainer,
              { paddingBottom: bottomTabHeight },
            ]}>
            <Button
              buttonText={t('common:save')}
              onPress={handleSubmit}
              backgroundColor={theme.colors.primary}
              style={styles.button}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </View>

      {/* Alert */}
      <Alert
        visible={alertVisible}
        title={t('transactionPage:alertTitle')}
        subtitle={alertMessage}
        primaryButtonText={t('common:ok')}
        onPrimaryPress={hideAlert}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  topSection: {
    paddingTop: 15,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 5,
  },
  moneyLabel: {
    color: theme.colors.textHint,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    paddingTop: 15,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
    marginBottom: 20,
  },
});
