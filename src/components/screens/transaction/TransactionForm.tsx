import React, { useState, useCallback, useEffect } from 'react';
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

export const TransactionForm: React.FC<TransactionFormProps> = ({
  formType,
  transaction,
  onSubmit,
  submitError,
  isSubmitting = false,
}) => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // Store data
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankCards = useDataStore(state => state.bankCards);
  const bankTypes = useDataStore(state => state.bankTypes);
  const categories = useDataStore(state => state.categories);

  // Form state
  const [money, setMoney] = useState(transaction?.money || '');
  const [description, setDescription] = useState(
    transaction?.description || '',
  );
  const [note, setNote] = useState(transaction?.note || '');
  const [date, setDate] = useState(
    transaction?.date
      ? dayjs(transaction.date).format('DD-MM-YYYY')
      : dayjs().format('DD-MM-YYYY'),
  );
  const [recived, setRecived] = useState(transaction?.recived || false);
  const [recurrent, setRecurrent] = useState(transaction?.recurrent || false);
  const [repeat, setRepeat] = useState(transaction?.repeat || false);

  // Selection state
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [selectedBankImage, setSelectedBankImage] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Initialize selections from transaction
  useEffect(() => {
    if (transaction) {
      // Bank account
      const bankAccount = bankAccounts.find(
        ba => ba.id === transaction.bankAccountId,
      );
      if (bankAccount) {
        setSelectedBank(bankAccount);
        const bankType = bankTypes.find(bt => bt.id === bankAccount.bankTypeId);
        setSelectedBankImage(bankType?.imageUrl || null);
      }

      // Category
      const category = categories.find(c => c.id === transaction.categoryId);
      if (category) {
        setSelectedCategory(category);
      }

      // Card
      const card = bankCards.find(c => c.id === transaction.cardId);
      if (card) {
        setSelectedCard(card);
      }
    }
  }, [transaction, bankAccounts, bankTypes, categories, bankCards]);

  // Show submit error
  useEffect(() => {
    if (submitError) {
      setAlertMessage(submitError);
      setAlertVisible(true);
    }
  }, [submitError]);

  // Handlers
  const handleOpenDatePicker = useCallback(async () => {
    const prevDate = dayjs(date, 'DD-MM-YYYY');

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
        .format('DD-MM-YYYY');
      setDate(newDate);
    }
  }, [date]);

  const handleOpenCategorySheet = useCallback(async () => {
    const result = await SheetManager.show('select-category-sheet', {
      payload: {
        type: formType === 'income' ? 'income' : 'expenses',
      },
    });

    // if (result?.item) {
    //   setSelectedCategory(result.item);
    // }
  }, [formType]);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');

    if (result?.bankAccount) {
      const bankAccount = result.bankAccount;
      setSelectedBank(bankAccount);

      const bankType = bankTypes.find(bt => bt.id === bankAccount.bankTypeId);
      setSelectedBankImage(bankType?.imageUrl || null);
    }
  }, [bankTypes]);

  const handleOpenCardSheet = useCallback(async () => {
    const result = await SheetManager.show('card-select-sheet');

    // if (result?.card) {
    //   setSelectedCard(result.card);
    // }
  }, []);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    // Validation
    if (formType !== 'card_spending' && !selectedBank) {
      setAlertMessage(t('transactionPage:errors.bankRequired'));
      setAlertVisible(true);
      return;
    }

    if (formType === 'card_spending' && !selectedCard) {
      setAlertMessage(t('transactionPage:errors.cardRequired'));
      setAlertVisible(true);
      return;
    }

    if (!selectedCategory) {
      setAlertMessage(t('transactionPage:errors.categoryRequired'));
      setAlertVisible(true);
      return;
    }

    if (!money || money === '0') {
      setAlertMessage(t('transactionPage:errors.moneyRequired'));
      setAlertVisible(true);
      return;
    }

    if (!date) {
      setAlertMessage(t('transactionPage:errors.dateRequired'));
      setAlertVisible(true);
      return;
    }

    if (!description.trim()) {
      setAlertMessage(t('transactionPage:errors.descriptionRequired'));
      setAlertVisible(true);
      return;
    }

    // const values: EditTransaction = {
    //   id: transaction?.id,
    //   bankAccountId: selectedBank?.id || 0,
    //   cardAccountId: selectedCard?.id || null,
    //   categoryId: selectedCategory.id,
    //   money,
    //   recived,
    //   date,
    //   description: description.trim(),
    //   recurrent,
    //   repeat,
    //   note,
    // };
    //
    // onSubmit(values);
  }, [
    isSubmitting,
    formType,
    selectedBank,
    selectedCard,
    selectedCategory,
    money,
    date,
    description,
    recived,
    recurrent,
    repeat,
    note,
    transaction?.id,
    onSubmit,
    t,
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
            value={money}
            onChange={setMoney}
            keyboardType="numeric"
            borderBottom={false}
            editable={!isSubmitting}
          />
        </View>

        {/* Bottom Section - Form Fields */}
        <View style={styles.bottomSection}>
          <View style={styles.inputsContainer}>
            {/* Recived Switch (not for card_spending) */}
            {/*{formType !== 'card_spending' && (*/}
            <SwitchInput
              placeholder={t('transactionPage:recivedPlaceholder')}
              value={recived}
              iconName="checkmark-circle-outline"
              onValueChange={setRecived}
              disabled={isSubmitting}
            />
            {/*)}*/}

            {/* Date */}
            <DateInputField
              value={date}
              iconName="calendar-outline"
              placeholder={t('transactionPage:datePlaceholder')}
              onPress={handleOpenDatePicker}
              // isDisabled={isSubmitting}
            />

            {/* Description */}
            <InputIconField
              placeholder={t('transactionPage:descriptionPlaceholder')}
              value={description}
              onChange={setDescription}
              iconName="edit-outline"
              editable={!isSubmitting}
            />

            {/* Category */}
            <SelectInput
              placeholder={t('transactionPage:categoryPlaceholder')}
              value={selectedCategory?.name}
              iconName="bookmark-outline"
              // selectedCategoryIconName={
              //   selectedCategory?.categoryIcon?.iconName
              // }
              selectedBorderColor={selectedCategory?.categoryColor?.hexCode}
              valueBordered
              onPress={handleOpenCategorySheet}
              // isDisabled={isSubmitting}
            />

            {/* Bank Account (not for card_spending) */}
            {/*{formType !== 'card_spending' && (*/}
            <SelectInput
              placeholder={t('transactionPage:bankPlaceholder')}
              value={selectedBank?.name}
              iconName="grid-outline"
              // selectedImageUrl={selectedBankImage}
              selectedBorderColor={theme.colors.textHint}
              valueBordered
              onPress={handleOpenBankAccountSheet}
              // isDisabled={isSubmitting}
            />
            {/*)}*/}

            {/* Card (only for card_spending) */}
            {/*{formType === 'card_spending' && (*/}
            <SelectInput
              placeholder={t('transactionPage:cardPlaceholder')}
              value={selectedCard?.name}
              iconName="credit-card-outline"
              valueBordered
              onPress={handleOpenCardSheet}
              // isDisabled={isSubmitting}
            />
            {/*)}*/}

            {/* Recurrent Switch */}
            <SwitchInput
              placeholder={t('transactionPage:recurrentPlaceholder')}
              value={recurrent}
              iconName="sync-outline"
              onValueChange={setRecurrent}
              disabled={isSubmitting}
            />

            {/* Repeat Switch */}
            <SwitchInput
              placeholder={t('transactionPage:repeatPlaceholder')}
              value={repeat}
              iconName="repeat-outline"
              onValueChange={setRepeat}
              disabled={isSubmitting}
            />

            {/* Note */}
            <InputIconField
              placeholder={t('transactionPage:notePlaceholder')}
              value={note}
              onChange={setNote}
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
        onPrimaryPress={() => setAlertVisible(false)}
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
  },
});
