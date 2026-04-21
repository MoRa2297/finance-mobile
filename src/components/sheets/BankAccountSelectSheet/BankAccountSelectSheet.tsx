import React, { useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { useBankAccounts } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';
import { EntityImage } from '@components/ui/EntityImage';
import { EmptyData } from '@components/common';

export const BankAccountSelectSheet: React.FC<
  SheetProps<'bank-account-select-sheet'>
> = ({ sheetId }) => {
  const { t } = useTranslation(['bankCardsPage', 'bankAccountPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { height } = useWindowDimensions();
  const { data: bankAccounts = [] } = useBankAccounts();

  const handleSelect = useCallback(
    (bankAccount: BankAccount) => {
      SheetManager.hide(sheetId, { payload: { bankAccount } });
    },
    [sheetId],
  );

  const renderItem = useCallback(
    ({ item }: { item: BankAccount }) => (
      <Pressable
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.itemContainerPressed,
        ]}
        onPress={() => handleSelect(item)}>
        <EntityImage
          imageUrl={item.bankType?.imageUrl}
          fallbackText={item.bankType?.name}
          size={40}
          borderRadius={GLOBAL_BORDER_RADIUS / 2}
        />
        <View style={styles.nameContainer}>
          <Text category="s1" style={styles.itemText}>
            {item.name}
          </Text>
          {item.bankType?.name && (
            <Text category="c1" style={styles.itemSubtext}>
              {item.bankType.name}
            </Text>
          )}
        </View>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={24}
        />
      </Pressable>
    ),
    [handleSelect],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyData
        variant="centered"
        iconName="credit-card-outline"
        title={t('bankAccountPage:empty.title')}
        subtitle={t('bankAccountPage:empty.subtitle')}
      />
    ),
    [t],
  );

  const isEmpty = bankAccounts.length === 0;

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      gestureEnabled
      closable
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <Text category="h6" style={styles.title}>
          {t('bankCardsPage:selectBank')}
        </Text>

        <View style={{ minHeight: height * 0.3, maxHeight: height * 0.5 }}>
          <FlatList
            data={bankAccounts}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              isEmpty && styles.listContentEmpty,
            ]}
            ListEmptyComponent={renderEmpty}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  content: {
    paddingTop: 15,
  },
  title: {
    color: theme.colors.basic100,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 14,
    gap: 12,
  },
  itemContainerPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  },
  nameContainer: {
    flex: 1,
    gap: 2,
  },
  itemText: {
    color: theme.colors.basic100,
  },
  itemSubtext: {
    color: theme.colors.textHint,
    fontSize: 11,
  },
});
