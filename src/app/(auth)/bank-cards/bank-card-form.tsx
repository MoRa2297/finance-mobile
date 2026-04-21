import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { SelectPickerInput } from '@components/ui/SelectPickerInput';
import { Header } from '@components/ui/Header';
import { useBankCardForm } from '@hooks/screens/bankCards';

export default function BankCardFormScreen() {
  const { t } = useTranslation(['bankCardsPage', 'common']);

  const {
    formik,
    isEditing,
    firstError,
    alertVisible,
    setAlertVisible,
    handleSubmit,
    handleOpenCardTypeSheet,
    handleOpenBankAccountSheet,
    handleOpenMonthPicker,
    handleOpenYearPicker,
  } = useBankCardForm();

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'text', text: t('common:cancel') }}
        center={{
          type: 'title',
          title: isEditing
            ? t('bankCardsPage:headerTitleEdit')
            : t('bankCardsPage:headerTitleNew'),
        }}
      />

      <View style={styles.formContainer}>
        <View style={styles.topSection}>
          <Text category="p2" style={styles.sectionLabel}>
            {t('bankCardsPage:cardLimitTitle')}
          </Text>
          <InputIconField
            placeholder={t('bankCardsPage:cardLimitPlaceholder')}
            value={formik.values.cardLimit}
            onChange={v => formik.setFieldValue('cardLimit', v)}
            keyboardType="numeric"
            borderBottom={false}
          />
        </View>

        <View style={styles.bottomSection}>
          <ScrollView
            contentContainerStyle={styles.bottomContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <InputIconField
              placeholder={t('bankCardsPage:namePlaceholder')}
              value={formik.values.name}
              onChange={v => formik.setFieldValue('name', v)}
              iconName="edit-outline"
            />
            <SelectInput
              placeholder={t('bankCardsPage:typeCardPlaceholder')}
              value={formik.values.cardType?.name}
              iconName="grid-outline"
              selectedImageUrl={formik.values.cardType?.imageUrl}
              selectedFallbackText={formik.values.cardType?.name}
              valueBordered
              onPress={handleOpenCardTypeSheet}
            />
            <SelectInput
              placeholder={t('bankCardsPage:selectBank')}
              value={formik.values.bankAccount?.name}
              iconName="grid-outline"
              selectedImageUrl={formik.values.bankAccount?.bankType?.imageUrl}
              selectedFallbackText={formik.values.bankAccount?.bankType?.name}
              valueBordered
              onPress={handleOpenBankAccountSheet}
            />
            <SelectPickerInput
              placeholder={t('bankCardsPage:monthExpiryPlaceholder')}
              value={formik.values.monthExpiry}
              iconName="calendar-outline"
              onPress={handleOpenMonthPicker}
            />
            <SelectPickerInput
              placeholder={t('bankCardsPage:yearExpiryPlaceholder')}
              value={formik.values.yearExpiry}
              iconName="calendar-outline"
              onPress={handleOpenYearPicker}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              buttonText={t('common:save')}
              onPress={handleSubmit}
              style={styles.submitButton}
              isLoading={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
            />
          </View>
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title={t('bankCardsPage:alertTitle')}
        subtitle={firstError ?? ''}
        primaryButtonText={t('bankCardsPage:alertButtonText')}
        onPrimaryPress={() => setAlertVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.secondaryBK },
  formContainer: { flex: 1 },
  topSection: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 15, gap: 5 },
  sectionLabel: { color: theme.colors.textHint },
  bottomSection: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 10,
  },
  bottomContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: theme.colors.primaryBK,
  },
  submitButton: {
    width: '60%',
    alignSelf: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.primary,
  },
});
