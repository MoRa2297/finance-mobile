import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { InputIconField } from '@components/ui/InputIconField';
import { ColorInputField } from '@components/ui/ColorInputField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { Header } from '@components/ui/Header';
import { useBankAccountForm } from '@/hooks/screens/bankAccounts/useBankAccountForm';

export default function BankAccountFormScreen() {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const [alertVisible, setAlertVisible] = useState(false);

  const {
    formik,
    isEditing,
    colors,
    firstError,
    handleOpenBankSheet,
    handleOpenAccountTypeSheet,
  } = useBankAccountForm();

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        name: true,
        startingBalance: true,
        bankType: true,
        accountType: true,
      });
      setAlertVisible(true);
      return;
    }
    formik.handleSubmit();
  };

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
            ? t('bankAccountPage:headerTitleEdit')
            : t('bankAccountPage:headerTitleNew'),
        }}
      />

      <View style={styles.topSection}>
        <Text category="p2" style={styles.sectionLabel}>
          {t('bankAccountPage:moneyBalanceTitle')}
        </Text>
        <InputIconField
          placeholder={t('bankAccountPage:moneyBalancePlaceholder')}
          value={formik.values.startingBalance}
          onChange={v => formik.setFieldValue('startingBalance', v)}
          keyboardType="numeric"
          borderBottom={false}
        />
      </View>

      <View style={styles.bottomSection}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <SelectInput
            placeholder={t('bankAccountPage:bankSelectPlaceholder')}
            value={formik.values.bankType?.name}
            iconName="grid-outline"
            selectedFallbackText={formik.values.bankType?.name}
            onPress={handleOpenBankSheet}
          />

          <InputIconField
            placeholder={t('bankAccountPage:namePlaceholder')}
            value={formik.values.name}
            onChange={v => formik.setFieldValue('name', v)}
            iconName="edit-outline"
          />

          <SelectInput
            placeholder={t('bankAccountPage:typeSelectPlaceholder')}
            value={
              formik.values.accountType
                ? t(`bankAccountPage:types.${formik.values.accountType.name}`)
                : undefined
            }
            iconName="grid-outline"
            onPress={handleOpenAccountTypeSheet}
          />

          <ColorInputField
            value={formik.values.color}
            onChange={v => formik.setFieldValue('color', v)}
            iconName="color-palette-outline"
            colors={colors}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            buttonText={t('common:save')}
            onPress={handleSubmit}
            backgroundColor={theme.colors.primary}
            style={styles.submitButton}
            isLoading={formik.isSubmitting}
          />
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title={t('bankAccountPage:alertTitle')}
        subtitle={firstError ?? ''}
        primaryButtonText={t('bankAccountPage:alertButtonText')}
        onPrimaryPress={() => setAlertVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  topSection: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
  },
  sectionLabel: {
    color: theme.colors.textHint,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
    backgroundColor: theme.colors.primaryBK,
  },
  submitButton: {
    width: '60%',
    alignSelf: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    marginBottom: 20,
  },
});
