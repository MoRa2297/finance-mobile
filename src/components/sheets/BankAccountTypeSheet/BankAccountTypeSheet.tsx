import React, { useRef } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { useDataStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccountType } from '@/types';

export const BankAccountTypeSheet: React.FC<
  SheetProps<'bank-account-type-sheet'>
> = props => {
  const { t } = useTranslation();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const bankAccountTypes = useDataStore(state => state.bankAccountTypes);

  const handleSelect = (accountType: BankAccountType) => {
    // actionSheetRef.current?.hide({ accountType });
  };

  const renderItem = ({ item }: { item: BankAccountType }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <View style={styles.iconContainer}>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.basic100}
          size={24}
        />
      </View>
      <Text category="s1" style={styles.itemText}>
        {t(`common.bankAccountTypes.${item.name}`)}
      </Text>
    </Pressable>
  );

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      gestureEnabled
      closable
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={bankAccountTypes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
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
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
});
