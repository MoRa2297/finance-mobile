import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { TransactionFormTypes } from '@/types';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { DateInputField } from '@components/ui/DateInputField';
import { SwitchInput } from '@components/ui/SwitchInput';
import type { useTransactionForm } from '@/hooks/screens/transaction/useTransactionForm';

type TransactionFormProps = ReturnType<typeof useTransactionForm>;

export const TransactionForm: React.FC<TransactionFormProps> = ({
  formik,
  formType,
  selection,
  isCardExpense,
  isSubmitting,
  alertVisible,
  firstError,
  setAlertVisible,
  handleSubmit,
  handleOpenDatePicker,
  handleOpenCategorySheet,
  handleOpenBankAccountSheet,
  handleOpenCardSheet,
}) => {
  const { t } = useTranslation(['transactionPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Money */}
        <View style={styles.topSection}>
          <Text category="p2" style={styles.moneyLabel}>
            {t(`transactionPage:moneyValueTypes.${formType}`)}
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
            {!isCardExpense && (
              <SwitchInput
                placeholder={t('transactionPage:recivedPlaceholder')}
                value={formik.values.recived}
                iconName="checkmark-circle-outline"
                onValueChange={v => formik.setFieldValue('recived', v)}
                disabled={isSubmitting}
              />
            )}

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

            <SelectInput
              placeholder={t('transactionPage:categoryPlaceholder')}
              value={selection.category?.name}
              iconName="bookmark-outline"
              selectedBorderColor={selection.category?.categoryColor?.hexCode}
              valueBordered
              onPress={handleOpenCategorySheet}
            />

            {!isCardExpense && (
              <SelectInput
                placeholder={t('transactionPage:bankPlaceholder')}
                value={selection.bankAccount?.name}
                iconName="grid-outline"
                selectedImageUrl={selection.bankAccount?.bankType?.imageUrl}
                selectedFallbackText={selection.bankAccount?.bankType?.name}
                valueBordered
                onPress={handleOpenBankAccountSheet}
              />
            )}

            {(isCardExpense || selection.bankAccount) && (
              <SelectInput
                placeholder={t('transactionPage:cardPlaceholder')}
                value={selection.card?.name}
                iconName="credit-card-outline"
                valueBordered
                onPress={handleOpenCardSheet}
              />
            )}

            <SwitchInput
              placeholder={t('transactionPage:recurrentPlaceholder')}
              value={formik.values.recurrent}
              iconName="sync-outline"
              onValueChange={v => formik.setFieldValue('recurrent', v)}
              disabled={isSubmitting}
            />

            <SwitchInput
              placeholder={t('transactionPage:repeatPlaceholder')}
              value={formik.values.repeat}
              iconName="repeat-outline"
              onValueChange={v => formik.setFieldValue('repeat', v)}
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
              backgroundColor={theme.colors.primary}
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
  },
});
