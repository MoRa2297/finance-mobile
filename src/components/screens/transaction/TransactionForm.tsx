import React, { FC } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { TransactionFormTypes, BankAccount, BankCard, Category } from '@/types';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { DateInputField } from '@components/ui/DateInputField';
import { RecurrenceSelector } from '@components/ui/RecurrenceSelector';
import { TransactionFormValues } from '@/hooks/screens/transaction/useTransactionForm';

interface SelectionState {
  bankAccount: BankAccount | null;
  category: Category | null;
  card: BankCard | null;
  toAccount: BankAccount | null;
}

interface TransactionFormProps {
  formik: FormikProps<TransactionFormValues>;
  formType: TransactionFormTypes;
  selection: SelectionState;
  isSubmitting: boolean;
  alertVisible: boolean;
  firstError: string | null;
  setAlertVisible: (visible: boolean) => void;
  handleSubmit: () => void;
  handleOpenDatePicker: () => void;
  handleOpenCategorySheet: () => void;
  handleOpenBankAccountSheet: () => void;
  handleOpenToAccountSheet: () => void;
  handleOpenCardSheet: () => void;
}

export const TransactionForm: FC<TransactionFormProps> = ({
  formik,
  formType,
  selection,
  isSubmitting,
  alertVisible,
  firstError,
  setAlertVisible,
  handleSubmit,
  handleOpenDatePicker,
  handleOpenCategorySheet,
  handleOpenBankAccountSheet,
  handleOpenToAccountSheet,
  handleOpenCardSheet,
}) => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);
  const isTransfer = formType === TransactionFormTypes.TRANSFER;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Money */}
        <View style={styles.topSection}>
          <Text category="p2" style={styles.moneyLabel}>
            {t(`transactionPage:moneyValueTypes.${formType.toLowerCase()}`)}
          </Text>
          <InputIconField
            placeholder={t('transactionPage:moneyValuePlaceholder')}
            value={formik.values.money}
            onChange={v => formik.setFieldValue('money', v)}
            keyboardType="numeric"
            borderBottom={false}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.inputsContainer}>
            <DateInputField
              value={formik.values.date}
              iconName="calendar-outline"
              placeholder={t('transactionPage:datePlaceholder')}
              onPress={handleOpenDatePicker}
            />

            <InputIconField
              placeholder={t('transactionPage:descriptionPlaceholder')}
              value={formik.values.description}
              onChange={v => formik.setFieldValue('description', v)}
              iconName="edit-outline"
              editable={!isSubmitting}
            />

            {isTransfer ? (
              <>
                <SelectInput
                  placeholder={t('transactionPage:fromAccountPlaceholder')}
                  value={selection.bankAccount?.name}
                  iconName="grid-outline"
                  selectedImageUrl={selection.bankAccount?.bankType?.imageUrl}
                  selectedFallbackText={selection.bankAccount?.bankType?.name}
                  valueBordered
                  onPress={handleOpenBankAccountSheet}
                />
                <SelectInput
                  placeholder={t('transactionPage:toAccountPlaceholder')}
                  value={selection.toAccount?.name}
                  iconName="grid-outline"
                  selectedImageUrl={selection.toAccount?.bankType?.imageUrl}
                  selectedFallbackText={selection.toAccount?.bankType?.name}
                  valueBordered
                  onPress={handleOpenToAccountSheet}
                />
              </>
            ) : (
              <>
                <SelectInput
                  placeholder={t('transactionPage:categoryPlaceholder')}
                  value={selection.category?.name}
                  iconName="bookmark-outline"
                  selectedBorderColor={
                    selection.category?.categoryColor?.hexCode
                  }
                  valueBordered
                  onPress={handleOpenCategorySheet}
                />
                <SelectInput
                  placeholder={t('transactionPage:bankPlaceholder')}
                  value={selection.bankAccount?.name}
                  iconName="grid-outline"
                  selectedImageUrl={selection.bankAccount?.bankType?.imageUrl}
                  selectedFallbackText={selection.bankAccount?.bankType?.name}
                  valueBordered
                  onPress={handleOpenBankAccountSheet}
                />
                {selection.bankAccount && (
                  <SelectInput
                    placeholder={t('transactionPage:cardPlaceholder')}
                    value={selection.card?.name}
                    iconName="credit-card-outline"
                    valueBordered
                    onPress={handleOpenCardSheet}
                  />
                )}
              </>
            )}

            <RecurrenceSelector
              values={formik.values.recurrence}
              onChange={value => formik.setFieldValue('recurrence', value)}
              disabled={isSubmitting}
            />

            <InputIconField
              placeholder={t('transactionPage:notePlaceholder')}
              value={formik.values.note}
              onChange={v => formik.setFieldValue('note', v)}
              iconName="edit-outline"
              editable={!isSubmitting}
            />
          </View>

          <View
            style={[
              styles.buttonContainer,
              { paddingBottom: bottomTabHeight },
            ]}>
            <Button
              buttonText={t('common:save')}
              onPress={handleSubmit}
              style={styles.button}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title={t('transactionPage:alertTitle')}
        subtitle={firstError ?? ''}
        primaryButtonText={t('common:ok')}
        onPrimaryPress={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: theme.colors.transparent },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1 },
  topSection: { paddingTop: 15, paddingHorizontal: HORIZONTAL_PADDING, gap: 5 },
  moneyLabel: { color: theme.colors.textHint },
  bottomSection: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  inputsContainer: { paddingTop: 15, paddingHorizontal: HORIZONTAL_PADDING },
  buttonContainer: { alignItems: 'center', paddingVertical: 20 },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
    marginBottom: 20,
    backgroundColor: theme.colors.primary,
  },
});
