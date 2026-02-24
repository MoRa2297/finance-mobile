import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { BankCard } from '@/types';
import { BankCardListCard } from '@components/screens/settings/bankCards/BankCardListCard';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@/components/ui/TopRoundedContainer';
import { Alert } from '@components/ui/Alert';
import { EmptyData } from '@components/common';
import { SpecificPrice } from '@components/screens/home';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { useBankCardsScreen } from '@/hooks/screens/bankCards';

export default function BankCardsScreen() {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const {
    bankCards,
    totLimit,
    totSpent,
    alertVisible,
    handleSelectMonth,
    handleCardPress,
    handleOptionsPress,
    handleAddCard,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useBankCardsScreen();

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
    () => <EmptyData title={t('bankCardsPage:emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback((item: BankCard) => item.id.toString(), []);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <TopRoundedContainer height="30%" paddingTop={0}>
        <Header
          left={{ type: 'back', variant: 'icon' }}
          right={{ type: 'settings', onPress: handleAddCard }}
        />

        <View style={styles.subContainer}>
          <View style={styles.pickerContainer}>
            <MonthSwipePicker
              onSelectMonth={handleSelectMonth}
              containerWidth={150}
              showArrows
            />
          </View>

          <View style={styles.amountContainer}>
            <SpecificPrice
              title={t('bankCardsPage:totalLimit')}
              amount={`€ ${totLimit.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-down-outline"
              iconColor={theme.colors.basic100}
            />
            <SpecificPrice
              title={t('bankCardsPage:spentTotal')}
              amount={`€ ${totSpent.toFixed(2)}`}
              amountColor={theme.colors.basic100}
              iconName="arrow-circle-up-outline"
              iconColor={theme.colors.basic100}
            />
          </View>
        </View>
      </TopRoundedContainer>

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

      <Alert
        visible={alertVisible}
        title={t('bankCardsPage:alertTitle')}
        subtitle={t('bankCardsPage:alertSubTitle')}
        primaryButtonText={t('common:delete')}
        secondaryButtonText={t('common:cancel')}
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
  subContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
});
