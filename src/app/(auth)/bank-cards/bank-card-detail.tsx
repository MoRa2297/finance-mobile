import React, { useCallback } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Transaction } from '@/types';
import { ExpenseCard } from '@/components/screens/expenses';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { EmptyData } from '@components/common';
import { Alert } from '@components/ui/Alert';
import { GenericSmallDetail } from '@components/ui/GenericSmallDetail';
import { EntityImage } from '@components/ui/EntityImage';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { useBankCardDetailScreen } from '@hooks/screens/bankCards';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

export default function BankCardDetailScreen() {
  const { t } = useTranslation(['bankCardsPage', 'common']);

  const {
    bankCard,
    cardType,
    dateRange,
    sections,
    totalSpent,
    contentStyle,
    isAlertVisible,
    setIsAlertVisible,
    handleSelectMonth,
    handleSettingsPress,
    handleTransactionPress,
    handleSelectRemoveTransaction,
    handleDeleteTransaction,
  } = useBankCardDetailScreen();

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard
        transaction={item}
        onPress={() => handleTransactionPress(item)}
        onDelete={() => handleSelectRemoveTransaction(item)}
      />
    ),
    [handleTransactionPress, handleSelectRemoveTransaction],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <Text category="p1" style={styles.sectionHeader}>
        {section.title}
      </Text>
    ),
    [],
  );

  const renderEmpty = useCallback(
    () => <EmptyData title={t('bankCardsPage:emptyTransactions')} />,
    [t],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  if (!bankCard) {
    return (
      <ScreenContainer style={styles.container}>
        <Header left={{ type: 'back', variant: 'icon' }} />
        <View style={styles.errorContainer}>
          <Text category="s1" style={styles.errorText}>
            {t('bankCardsPage:notFound')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'icon' }}
        center={{ type: 'title', title: bankCard.name }}
        right={{ type: 'settings', onPress: handleSettingsPress }}
      />

      <View style={styles.pickerContainer}>
        <MonthSwipePicker
          onSelectMonth={handleSelectMonth}
          containerWidth={150}
          showArrows
        />
      </View>

      <View style={[styles.contentContainer, contentStyle]}>
        <View style={styles.cardImageContainer}>
          <EntityImage
            imageUrl={cardType?.imageUrl}
            fallbackText={cardType?.name}
            size={70}
            borderRadius={35}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.rowContainer}>
            <GenericSmallDetail
              title={t('bankCardsPage:startPeriod')}
              iconName="calendar-outline"
              value={dateRange.start || '-'}
            />
            <GenericSmallDetail
              title={t('bankCardsPage:endPeriod')}
              iconName="calendar-outline"
              value={dateRange.end || '-'}
            />
          </View>

          <View style={styles.singleRowContainer}>
            <GenericSmallDetail
              title={t('bankCardsPage:totalSpent')}
              iconName="activity-outline"
              value={`€ ${totalSpent.toFixed(2)}`}
            />
          </View>

          <SectionList
            sections={sections}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            style={styles.list}
          />
        </View>
      </View>

      <Alert
        visible={isAlertVisible}
        title={t('bankCardsPage:alertDeleteTitle')}
        subtitle={t('bankCardsPage:alertDeleteSubTitle')}
        primaryButtonText={t('common:delete')}
        secondaryButtonText={t('common:cancel')}
        onPrimaryPress={handleDeleteTransaction}
        onSecondaryPress={() => setIsAlertVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.secondaryBK },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: theme.colors.textHint },
  pickerContainer: { alignItems: 'center', width: '100%', paddingVertical: 10 },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  cardImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 15,
    paddingTop: 15,
  },
  rowContainer: { flexDirection: 'row' },
  singleRowContainer: { flexDirection: 'row' },
  list: { flex: 1 },
  sectionHeader: {
    fontSize: 17,
    backgroundColor: theme.colors.primaryBK,
    paddingVertical: 10,
    color: theme.colors.textHint,
  },
  separator: { height: 15 },
});
