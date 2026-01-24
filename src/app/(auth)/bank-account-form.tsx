import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { COLORS } from '@/config';
import { BankType, BankAccountType } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { InputIconField } from '@components/ui/InputIconField';
import { ColorInputField } from '@components/ui/ColorInputField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';

export default function BankAccountFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  // Stores
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankTypes = useDataStore(state => state.bankTypes);
  const bankAccountTypes = useDataStore(state => state.bankAccountTypes);
  const addBankAccount = useDataStore(state => state.addBankAccount);
  const updateBankAccount = useDataStore(state => state.updateBankAccount);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // Find existing bank account if editing
  const existingAccount = useMemo(() => {
    if (!id) return null;
    return bankAccounts.find(ba => ba.id === Number(id));
  }, [bankAccounts, id]);

  // Form state
  const [name, setName] = useState(existingAccount?.name || '');
  const [startingMoney, setStartingMoney] = useState(
    existingAccount?.startingBalance?.toString() || '',
  );
  const [color, setColor] = useState(() => {
    if (existingAccount?.colorId) {
      const foundColor = COLORS.find(c => c.id === existingAccount.colorId);
      return foundColor?.hexCode || '#5d4c86';
    }
    return '#5d4c86';
  });
  const [selectedBankType, setSelectedBankType] = useState<BankType | null>(
    () => {
      if (existingAccount?.bankTypeId) {
        return (
          bankTypes.find(bt => bt.id === existingAccount.bankTypeId) || null
        );
      }
      return null;
    },
  );
  const [selectedAccountType, setSelectedAccountType] =
    useState<BankAccountType | null>(() => {
      if (existingAccount?.bankAccountTypeId) {
        return (
          bankAccountTypes.find(
            bat => bat.id === existingAccount.bankAccountTypeId,
          ) || null
        );
      }
      return null;
    });

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Handlers
  const handleOpenBankSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-select-sheet');
    if (result?.bank) {
      setSelectedBankType(result.bank);
    }
  }, []);

  const handleOpenAccountTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-type-sheet');
    if (result?.accountType) {
      setSelectedAccountType(result.accountType);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    // Validation
    if (!selectedBankType) {
      setAlertMessage(t('components.bankAccountForm.alertBankIDError'));
      setAlertVisible(true);
      return;
    }
    if (!name.trim()) {
      setAlertMessage(t('components.bankAccountForm.alertNameError'));
      setAlertVisible(true);
      return;
    }
    if (!startingMoney) {
      setAlertMessage(t('components.bankAccountForm.alertStartingMoneyError'));
      setAlertVisible(true);
      return;
    }
    if (!selectedAccountType) {
      setAlertMessage(t('components.bankAccountForm.alertTypeError'));
      setAlertVisible(true);
      return;
    }

    const colorData = COLORS.find(c => c.hexCode === color);

    const accountData = {
      name: name.trim(),
      startingBalance: parseFloat(startingMoney),
      colorId: colorData?.id || 1,
      bankTypeId: selectedBankType.id,
      bankAccountTypeId: selectedAccountType.id,
      userId: 1,
    };

    if (isEditing && existingAccount) {
      updateBankAccount(existingAccount.id, accountData);
    } else {
      addBankAccount({
        id: Date.now(),
        ...accountData,
      });
    }

    router.back();
  }, [
    name,
    startingMoney,
    color,
    selectedBankType,
    selectedAccountType,
    isEditing,
    existingAccount,
    addBankAccount,
    updateBankAccount,
    router,
    t,
  ]);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header */}
      {/*<Header*/}
      {/*  title={*/}
      {/*    isEditing*/}
      {/*      ? t('screens.bankAccountFormScreen.headerTitleEdit')*/}
      {/*      : t('screens.bankAccountFormScreen.headerTitleNew')*/}
      {/*  }*/}
      {/*  showBackButton*/}
      {/*  backText={t('common.cancel')}*/}
      {/*/>*/}

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Starting Balance Section */}
        <View style={styles.topSection}>
          <Text category="p2" style={styles.sectionLabel}>
            {t('components.bankAccountForm.moneyBalanceTitle')}
          </Text>
          <InputIconField
            placeholder={t(
              'components.bankAccountForm.moneyBalancePlaceholder',
            )}
            value={startingMoney}
            onChange={setStartingMoney}
            keyboardType="numeric"
            borderBottom={false}
          />
        </View>

        {/* Main Form */}
        <ScrollView
          style={styles.bottomSection}
          contentContainerStyle={[
            styles.bottomContent,
            { paddingBottom: bottomTabHeight + 20 },
          ]}
          showsVerticalScrollIndicator={false}>
          {/* Bank Select */}
          <SelectInput
            placeholder={t('components.bankAccountForm.bankSelectPlaceholder')}
            value={selectedBankType?.name}
            iconName="grid-outline"
            selectedImageUrl={selectedBankType?.imageUrl}
            onPress={handleOpenBankSheet}
          />

          {/* Name */}
          <InputIconField
            placeholder={t('components.bankAccountForm.namePlaceholder')}
            value={name}
            onChange={setName}
            iconName="edit-outline"
          />

          {/* Account Type Select */}
          <SelectInput
            placeholder={t('components.bankAccountForm.typeSelectPlaceholder')}
            value={
              selectedAccountType
                ? t(`common.bankAccountTypes.${selectedAccountType.name}`)
                : undefined
            }
            iconName="grid-outline"
            onPress={handleOpenAccountTypeSheet}
          />

          {/* Color */}
          <ColorInputField
            value={color}
            onChange={setColor}
            iconName="cart-outline"
          />

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              buttonText={t('common.save')}
              onPress={handleSubmit}
              backgroundColor={theme.colors.primary}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </View>

      {/* Validation Alert */}
      <Alert
        visible={alertVisible}
        title={t('components.bankAccountForm.alertTitle')}
        subtitle={alertMessage}
        primaryButtonText={t('components.bankAccountForm.alertButtonText')}
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
  formContainer: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
    gap: 5,
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
  bottomContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 15,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  submitButton: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
