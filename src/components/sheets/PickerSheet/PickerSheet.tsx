import React, { useRef } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';

export interface PickerItem {
  id: number;
  name?: string;
  value?: number;
}

export const PickerSheet: React.FC<SheetProps<'picker-sheet'>> = ({
  sheetId,
  payload,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const data = payload?.data || [];

  const handleSelect = (item: PickerItem) => {
    SheetManager.hide(sheetId, {
      payload: { item },
    });
  };

  const renderItem = ({ item }: { item: PickerItem }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <Text category="s1" style={styles.itemText}>
        {item.name || item.value || item.id}
      </Text>
    </Pressable>
  );

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
          data={data}
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
    maxHeight: 300,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.textHint,
  },
  itemText: {
    color: theme.colors.basic100,
    fontSize: 18,
  },
});
