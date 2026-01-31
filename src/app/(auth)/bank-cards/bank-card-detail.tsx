import React, { useCallback } from 'react';
import { StyleSheet, View, SectionList, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Transaction } from '@/types';
import { ExpenseCard } from '@/components/screens/expenses';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { EmptyData } from '@components/common';
import { GenericSmallDetail } from '@components/ui/GenericSmallDetail';
import { Header } from '@components/ui/Header';
import { MonthSwipePicker } from '@components/ui/MonthSwipePicker';
import { useBankCardDetailScreen } from '@/hooks/screens/bankCards';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

export default function BankCardDetailScreen() {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const {
    bankCard,
    cardType,
    dateRange,
    sections,
    totalSpent,
    categories,
    bankAccounts,
    bankCards,
    handleSelectMonth,
    handleSettingsPress,
    handleTransactionPress,
  } = useBankCardDetailScreen();

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <ExpenseCard
        transaction={item}
        categories={categories}
        bankAccounts={bankAccounts}
        bankCards={bankCards}
        onPress={() => handleTransactionPress(item)}
      />
    ),
    [categories, bankAccounts, bankCards, handleTransactionPress],
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

      {/* Month Picker */}
      <View style={styles.pickerContainer}>
        <MonthSwipePicker
          onSelectMonth={handleSelectMonth}
          containerWidth={150}
          showArrows
        />
      </View>

      {/* Content */}
      <View
        style={[styles.contentContainer, { marginBottom: bottomTabHeight }]}>
        {/* Card Type Image */}
        {cardType?.imageUrl && (
          <View style={styles.cardImageContainer}>
            <Image
              source={{ uri: cardType.imageUrl }}
              style={styles.cardImage}
            />
          </View>
        )}

        {/* Details */}
        <View style={styles.detailsContainer}>
          {/* Date Range */}
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

          {/* Total Spent */}
          <View style={styles.singleRowContainer}>
            <GenericSmallDetail
              title={t('bankCardsPage:totalSpent')}
              iconName="activity-outline"
              value={`€ ${totalSpent.toFixed(2)}`}
            />
          </View>

          {/* Transactions List */}
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.textHint,
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
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
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  singleRowContainer: {
    flexDirection: 'row',
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 17,
    backgroundColor: theme.colors.primaryBK,
    paddingVertical: 10,
    color: theme.colors.textHint,
  },
  separator: {
    height: 15,
  },
});
