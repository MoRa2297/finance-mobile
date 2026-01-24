import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { BankCard, SwipePickerMonth } from '@/types';
import { getMonths } from '@/utils/date';
import { BankCardListCard } from '@components/screens/settings/bankCards/BankCardListCard';
import { EmptyData, SpecificPrice } from '@/components';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@/components/ui/TopRoundedContainer';
import { Alert } from '@components/ui/Alert';

export default function BankCardsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Stores
  const bankCards = useDataStore(state => state.bankCards);
  const transactions = useDataStore(state => state.transactions);
  const deleteBankCard = useDataStore(state => state.deleteBankCard);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // State
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<SwipePickerMonth | null>(
    null,
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  const MONTHS = useMemo(() => getMonths(), []);

  // Calculate total limit
  const totLimit = useMemo(() => {
    return bankCards.reduce((sum, card) => sum + parseFloat(card.cardLimit), 0);
  }, [bankCards]);

  // Calculate total spent (filtered by month if selected)
  const totSpent = useMemo(() => {
    let filteredTransactions = transactions;

    if (selectedDate) {
      const selectedMonth = selectedDate.date.getMonth();
      const selectedYear = selectedDate.date.getFullYear();

      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      });
    }

    return filteredTransactions
      .filter(t => t.type === 'card_spending' && t.recived)
      .reduce((sum, t) => sum + parseFloat(t.money), 0);
  }, [transactions, selectedDate]);

  // Handlers
  const handleGetSelectedMonth = useCallback(
    (selected: SwipePickerMonth, index: number) => {
      setCurrentSelectIndex(index);
      setSelectedDate(selected);
    },
    [],
  );

  const handleCardPress = useCallback(
    (card: BankCard) => {
      router.push({
        pathname: '/(auth)/bank-card-detail',
        params: { id: card.id },
      });
    },
    [router],
  );

  const handleOptionsPress = useCallback(
    (card: BankCard) => {
      const options = [
        t('screens.bankCardListScreen.actionSheetEditCard'),
        t('screens.bankCardListScreen.deleteBankCard'),
        t('common.cancel'),
      ];
      const destructiveButtonIndex = 1;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          // containerStyle: [
          //   styles.actionSheetContainer,
          //   { marginBottom: insets.bottom },
          // ],
          textStyle: styles.actionSheetText,
        },
        selectedIndex => {
          switch (selectedIndex) {
            case 0:
              router.push({
                pathname: '/(auth)/bank-card-form',
                params: { id: card.id },
              });
              break;
            case 1:
              setCardToDelete(card);
              setAlertVisible(true);
              break;
          }
        },
      );
    },
    [t, insets.bottom, showActionSheetWithOptions, router],
  );

  const handleAddCard = useCallback(() => {
    const options = [
      t('screens.bankCardListScreen.actionSheetCreateCard'),
      t('common.cancel'),
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // containerStyle: [
        //   styles.actionSheetContainer,
        //   { marginBottom: insets.bottom },
        // ],
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          router.push('/(auth)/bank-card-form');
        }
      },
    );
  }, [t, insets.bottom, showActionSheetWithOptions, router]);

  const handleDeleteConfirm = useCallback(() => {
    if (cardToDelete) {
      deleteBankCard(cardToDelete.id);
      setCardToDelete(null);
      setAlertVisible(false);
    }
  }, [cardToDelete, deleteBankCard]);

  const handleDeleteCancel = useCallback(() => {
    setCardToDelete(null);
    setAlertVisible(false);
  }, []);

  // Render
  const renderItem = useCallback(
    ({ item }: { item: BankCard }) => (
      <BankCardListCard
        bankCard={item}
        onPress={handleCardPress}
        onOptionsPress={handleOptionsPress}
      />
    ),
    [handleCardPress, handleOptionsPress],
  );

  const renderEmpty = useCallback(
    () => <EmptyData title={t('screens.bankCardListScreen.emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback((item: BankCard) => item.id.toString(), []);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Top Section */}
      <TopRoundedContainer height="30%" paddingTop={0}>
        <View style={styles.topBodyContent}>
          {/*<Header*/}
          {/*  title={t('screens.bankCardListScreen.headerTitle')}*/}
          {/*  showBackButton*/}
          {/*  onSettingsPress={handleAddCard}*/}
          {/*/>*/}

          <View style={styles.subContainer}>
            {/* Month Picker */}
            <View style={styles.pickerContainer}>
              {/*<MonthSwipePicker*/}
              {/*  currentSelectIndex={currentSelectIndex}*/}
              {/*  arrSwipeData={MONTHS}*/}
              {/*  showSwipeBtn*/}
              {/*  onScreenChange={handleGetSelectedMonth}*/}
              {/*  containerWidth={100}*/}
              {/*/>*/}
            </View>

            {/* Amounts */}
            <View style={styles.amountContainer}>
              <SpecificPrice
                title={t('screens.bankCardListScreen.totalLimit')}
                amount={`${totLimit.toFixed(2)} €`}
                amountColor={theme.colors.basic100}
                iconName="arrow-circle-down-outline"
                iconColor={theme.colors.basic100}
              />
              <SpecificPrice
                title={t('screens.bankCardListScreen.spentTotal')}
                amount={`${totSpent.toFixed(2)} €`}
                amountColor={theme.colors.basic100}
                iconName="arrow-circle-up-outline"
                iconColor={theme.colors.basic100}
              />
            </View>
          </View>
        </View>
      </TopRoundedContainer>

      {/* List */}
      <View style={styles.listContainer}>
        <FlatList
          data={bankCards}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomTabHeight * 2 },
            bankCards.length === 0 && styles.listContentEmpty,
          ]}
        />
      </View>

      {/* Delete Alert */}
      <Alert
        visible={alertVisible}
        title={t('screens.bankCardListScreen.alertTitle')}
        subtitle={t('screens.bankCardListScreen.alertSubTitle')}
        primaryButtonText={t('screens.bankCardListScreen.alertButtonYes')}
        secondaryButtonText={t('screens.bankCardListScreen.alertButtonNo')}
        onPrimaryPress={handleDeleteConfirm}
        onSecondaryPress={handleDeleteCancel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  topBodyContent: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.transparent,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  listContent: {
    paddingTop: 25,
    marginHorizontal: HORIZONTAL_PADDING,
    gap: 15,
  },
  listContentEmpty: {
    flex: 1,
  },
  actionSheetContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  actionSheetText: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.basic100,
  },
});
