import React, { FC, useRef } from 'react';
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
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccountType } from '@/types';
import { useBankAccountTypes } from '@stores/lookup';

const ACCOUNT_TYPE_ICONS: Record<number, string> = {
  1: 'credit-card-outline', // Checking Account
  2: 'save-outline', // Savings Account
  3: 'lock-outline', // Deposit Account
  4: 'trending-up-outline', // Investment Account
  5: 'briefcase-outline', // Business Account
  6: 'person-outline', // Youth Account
  7: 'globe-outline', // Online Account
};

export const BankAccountTypeSheet: FC<
  SheetProps<'bank-account-type-sheet'>
> = ({ sheetId }) => {
  const { t } = useTranslation(['bankAccountPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { height } = useWindowDimensions();

  const { data: bankAccountTypes = [] } = useBankAccountTypes();

  const handleSelect = (accountType: BankAccountType) => {
    SheetManager.hide(sheetId, { payload: { accountType } });
  };

  const renderItem = ({ item }: { item: BankAccountType }) => {
    const iconName = ACCOUNT_TYPE_ICONS[item.id] ?? 'grid-outline';

    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => handleSelect(item)}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.basic100} size={22} />
        </View>
        <Text category="s1" style={styles.itemText}>
          {t(`bankAccountPage:types.${item.name}`)}
        </Text>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={24}
        />
      </Pressable>
    );
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      gestureEnabled
      closable
      // useBottomSafeAreaPadding={true}
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <Text category="h6" style={styles.title}>
          {t('bankAccountPage:typeSelectPlaceholder')}
        </Text>

        <View style={{ minHeight: height * 0.3, maxHeight: height * 0.5 }}>
          <FlatList
            data={bankAccountTypes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
    borderWidth: 1,
    borderColor: 'red',
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
});
