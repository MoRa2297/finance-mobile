import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

import { useDataStore } from '@/stores';
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
import { Header } from '@components/ui/Header';

export default function BankAccountFormScreen() {
  const { t } = useTranslation('bankAccountPage');
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  // Stores
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankTypes = useDataStore(state => state.bankTypes);
  const bankAccountTypes = useDataStore(state => state.bankAccountTypes);
  const addBankAccount = useDataStore(state => state.addBankAccount);
  const updateBankAccount = useDataStore(state => state.updateBankAccount);

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
      setAlertMessage(t('bankAccountPage:alertBankIDError'));
      setAlertVisible(true);
      return;
    }
    if (!name.trim()) {
      setAlertMessage(t('bankAccountPage:alertNameError'));
      setAlertVisible(true);
      return;
    }
    if (!startingMoney) {
      setAlertMessage(t('bankAccountPage:alertStartingMoneyError'));
      setAlertVisible(true);
      return;
    }
    if (!selectedAccountType) {
      setAlertMessage(t('bankAccountPage:alertTypeError'));
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
      <Header
        left={{
          type: 'back',
          variant: 'text',
          text: 'Annulla',
        }}
        center={{
          type: 'title',
          title: isEditing
            ? t('bankAccountPage:headerTitleEdit')
            : t('bankAccountPage:headerTitleNew'),
        }}
      />

      {/* Top Section - Starting Balance */}
      <View style={styles.topSection}>
        <Text category="p2" style={styles.sectionLabel}>
          {t('bankAccountPage:moneyBalanceTitle')}
        </Text>
        <InputIconField
          placeholder={t('bankAccountPage:moneyBalancePlaceholder')}
          value={startingMoney}
          onChange={setStartingMoney}
          keyboardType="numeric"
          borderBottom={false}
        />
      </View>

      {/* Bottom Section - Form + Button */}
      <View style={styles.bottomSection}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <SelectInput
            placeholder={t('bankAccountPage:bankSelectPlaceholder')}
            value={selectedBankType?.name}
            iconName="grid-outline"
            selectedImageUrl={selectedBankType?.imageUrl}
            onPress={handleOpenBankSheet}
          />

          <InputIconField
            placeholder={t('bankAccountPage:namePlaceholder')}
            value={name}
            onChange={setName}
            iconName="edit-outline"
          />

          <SelectInput
            placeholder={t('bankAccountPage:typeSelectPlaceholder')}
            value={
              selectedAccountType
                ? t(`bankAccountPage:types.${selectedAccountType.name}`)
                : undefined
            }
            iconName="grid-outline"
            onPress={handleOpenAccountTypeSheet}
          />

          <ColorInputField
            value={color}
            onChange={setColor}
            iconName="color-palette-outline"
          />
        </ScrollView>

        {/* Fixed Button at Bottom */}
        <View style={[styles.buttonContainer]}>
          <Button
            buttonText={t('common:save')}
            onPress={handleSubmit}
            backgroundColor={theme.colors.primary}
            style={styles.submitButton}
          />
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title={t('bankAccountPage:alertTitle')}
        subtitle={alertMessage}
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
