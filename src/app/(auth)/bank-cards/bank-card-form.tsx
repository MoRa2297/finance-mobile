import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  MONTH_NUMBER,
  YEARS_NUMBER,
} from '@/config/constants';
import { CardType, BankAccount } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { SelectInput } from '@components/ui/SelectInput';
import { SelectPickerInput } from '@components/ui/SelectPickerInput';
import { Header } from '@components/ui/Header';

export default function BankCardFormScreen() {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  // Stores
  const bankCards = useDataStore(state => state.bankCards);
  const cardTypes = useDataStore(state => state.cardTypes);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankTypes = useDataStore(state => state.bankTypes);
  const addBankCard = useDataStore(state => state.addBankCard);
  const updateBankCard = useDataStore(state => state.updateBankCard);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // Find existing bank card if editing
  const existingCard = useMemo(() => {
    if (!id) return null;
    return bankCards.find(bc => bc.id === Number(id));
  }, [bankCards, id]);

  // Form state
  const [name, setName] = useState(existingCard?.name || '');
  const [cardLimit, setCardLimit] = useState(existingCard?.cardLimit || '');
  const [monthExpiry, setMonthExpiry] = useState<number>(
    existingCard?.monthExpiry || MONTH_NUMBER[0].id,
  );
  const [yearExpiry, setYearExpiry] = useState<number>(
    existingCard?.yearExpiry || YEARS_NUMBER[0].id,
  );
  const [selectedCardType, setSelectedCardType] = useState<CardType | null>(
    () => {
      if (existingCard?.cardTypeId) {
        return cardTypes.find(ct => ct.id === existingCard.cardTypeId) || null;
      }
      return null;
    },
  );
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount | null>(() => {
      if (existingCard?.bankAccountId) {
        return (
          bankAccounts.find(ba => ba.id === existingCard.bankAccountId) || null
        );
      }
      return null;
    });

  // Get bank image for selected account
  const selectedBankImage = useMemo(() => {
    if (!selectedBankAccount) return undefined;
    const bankType = bankTypes.find(
      bt => bt.id === selectedBankAccount.bankTypeId,
    );
    return bankType?.imageUrl;
  }, [selectedBankAccount, bankTypes]);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Handlers
  const handleOpenCardTypeSheet = useCallback(async () => {
    const result = await SheetManager.show('card-type-select-sheet');
    if (result?.cardType) {
      setSelectedCardType(result.cardType);
    }
  }, []);

  const handleOpenBankAccountSheet = useCallback(async () => {
    const result = await SheetManager.show('bank-account-select-sheet');
    if (result?.bankAccount) {
      setSelectedBankAccount(result.bankAccount);
    }
  }, []);

  const handleOpenMonthPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: MONTH_NUMBER },
    });
    if (result?.item?.name) {
      setMonthExpiry(Number(result.item.name));
    }
  }, []);

  const handleOpenYearPicker = useCallback(async () => {
    const result = await SheetManager.show('picker-sheet', {
      payload: { data: YEARS_NUMBER },
    });
    if (result?.item?.name) {
      setYearExpiry(Number(result.item.name));
    }
  }, []);

  const handleSubmit = useCallback(() => {
    // Validation
    if (!selectedBankAccount) {
      setAlertMessage(t('bankCardsPage:alertBankAccountIdError'));
      setAlertVisible(true);
      return;
    }
    if (!name.trim()) {
      setAlertMessage(t('bankCardsPage:alertNameError'));
      setAlertVisible(true);
      return;
    }
    if (!cardLimit) {
      setAlertMessage(t('bankCardsPage:alertCardLimitError'));
      setAlertVisible(true);
      return;
    }
    if (!selectedCardType) {
      setAlertMessage(t('bankCardsPage:alertTypeError'));
      setAlertVisible(true);
      return;
    }

    const cardData = {
      name: name.trim(),
      cardLimit,
      bankAccountId: selectedBankAccount.id,
      cardTypeId: selectedCardType.id,
      monthExpiry,
      yearExpiry,
    };

    if (isEditing && existingCard) {
      updateBankCard(existingCard.id, cardData);
    } else {
      addBankCard({
        id: Date.now(),
        ...cardData,
      });
    }

    router.back();
  }, [
    name,
    cardLimit,
    selectedBankAccount,
    selectedCardType,
    monthExpiry,
    yearExpiry,
    isEditing,
    existingCard,
    addBankCard,
    updateBankCard,
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
            ? t('bankCardsPage:headerTitleEdit')
            : t('bankCardsPage:headerTitleNew'),
        }}
      />

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Card Limit Section */}
        <View style={styles.topSection}>
          <Text category="p2" style={styles.sectionLabel}>
            {t('bankCardsPage:cardLimitTitle')}
          </Text>
          <InputIconField
            placeholder={t('bankCardsPage:cardLimitPlaceholder')}
            value={cardLimit}
            onChange={setCardLimit}
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
          {/* Name */}
          <InputIconField
            placeholder={t('bankCardsPage:namePlaceholder')}
            value={name}
            onChange={setName}
            iconName="edit-outline"
          />

          {/* Card Type Select */}
          <SelectInput
            placeholder={t('bankCardsPage:typeCardPlaceholder')}
            value={selectedCardType?.name}
            iconName="grid-outline"
            selectedImageUrl={selectedCardType?.imageUrl}
            selectedBorderColor={theme.colors.textHint}
            valueBordered
            onPress={handleOpenCardTypeSheet}
          />

          {/* Bank Account Select */}
          <SelectInput
            placeholder={t('bankCardsPage:selectBank')}
            value={selectedBankAccount?.name}
            iconName="grid-outline"
            selectedImageUrl={selectedBankImage}
            selectedBorderColor={theme.colors.textHint}
            valueBordered
            onPress={handleOpenBankAccountSheet}
          />

          {/* Month Expiry */}
          <SelectPickerInput
            placeholder={t('bankCardsPage:monthExpiryPlaceholder')}
            value={monthExpiry}
            iconName="calendar-outline"
            onPress={handleOpenMonthPicker}
          />

          {/* Year Expiry */}
          <SelectPickerInput
            placeholder={t('bankCardsPage:yearExpiryPlaceholder')}
            value={yearExpiry}
            iconName="calendar-outline"
            onPress={handleOpenYearPicker}
          />

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              buttonText={t('common:save')}
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
        title={t('bankCardsPage:alertTitle')}
        subtitle={alertMessage}
        primaryButtonText={t('bankCardsPage:alertButtonText')}
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
