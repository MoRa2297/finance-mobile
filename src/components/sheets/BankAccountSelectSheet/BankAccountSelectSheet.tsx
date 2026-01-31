import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, FlatList, Pressable, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { useDataStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankAccount } from '@/types';

export const BankAccountSelectSheet: React.FC<
  SheetProps<'bank-account-select-sheet'>
> = ({ sheetId }) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankTypes = useDataStore(state => state.bankTypes);

  const handleSelect = (bankAccount: BankAccount) => {
    SheetManager.hide(sheetId, {
      payload: { bankAccount },
    });
  };

  const renderItem = ({ item }: { item: BankAccount }) => {
    const bankType = bankTypes.find(bt => bt.id === item.bankTypeId);

    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => handleSelect(item)}>
        {bankType?.imageUrl ? (
          <Image source={{ uri: bankType.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon
              name="credit-card-outline"
              color={theme.colors.basic100}
              size={24}
            />
          </View>
        )}
        <Text category="s1" style={styles.itemText}>
          {item.name}
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
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={bankAccounts}
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
    maxHeight: 400,
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
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
});
