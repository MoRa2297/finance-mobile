import React, {
  FC,
  memo,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, List, Text } from '@ui-kitten/components';

import { theme } from '@config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@config/constants';
import { Category } from '@/types';
import { useCategoryStore, categorySelectors } from '@/stores';
import { Icon } from '@components/ui/Icon';

export type CategoryType = 'income' | 'expenses';

type SelectCategorySheetProps = SheetProps<'select-category-sheet'>;

const LIST_MAX_HEIGHT = SCREEN_HEIGHT / 1.5;
const LIST_MIN_HEIGHT = SCREEN_HEIGHT / 4;
const ICON_SIZE = 24;
const ICON_CONTAINER_SIZE = 40;

const ListItem: FC<{ item: Category; onSelect: (item: Category) => void }> =
  memo(({ item, onSelect }) => {
    const handlePress = useCallback(() => onSelect(item), [item, onSelect]);
    const iconName = item.categoryIcon?.iconName ?? 'folder-outline';

    return (
      <Pressable
        style={({ pressed }) => [
          styles.listItem,
          pressed && styles.listItemPressed,
        ]}
        onPress={handlePress}
        accessibilityRole="button">
        <View style={styles.iconContainer}>
          <Icon
            name={iconName}
            color={theme.colors.basic100}
            size={ICON_SIZE}
          />
        </View>
        <Text category="s1" style={styles.label}>
          {item.name}
        </Text>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={ICON_SIZE}
        />
      </Pressable>
    );
  });

export const SelectCategorySheet: FC<SelectCategorySheetProps> = ({
  sheetId,
  payload,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const categories = useCategoryStore(categorySelectors.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    console.log('filteredCategories: ', { categories, payload });
    if (!categories?.length || !payload?.type) return [];
    return categories.filter(c => c.type === payload.type);
  }, [categories, payload?.type]);

  const handleSelect = useCallback(
    (item: Category) => {
      SheetManager.hide(sheetId, { payload: { item } });
    },
    [sheetId],
  );

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <ListItem item={item} onSelect={handleSelect} />
    ),
    [handleSelect],
  );

  const renderSeparator = useCallback(
    () => <Layout style={styles.separator} />,
    [],
  );
  const keyExtractor = useCallback(
    (item: Category, i: number) => item.id?.toString() ?? `cat-${i}`,
    [],
  );

  return (
    <ActionSheet
      ref={actionSheetRef}
      drawUnderStatusBar
      closable
      closeOnTouchBackdrop
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.sheetContainer}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.content}>
        <List
          data={filteredCategories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  } as ViewStyle,
  content: {
    paddingTop: 25,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  list: {
    maxHeight: LIST_MAX_HEIGHT,
    minHeight: LIST_MIN_HEIGHT,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  separator: {
    height: 0,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  } as ViewStyle,
  listItemPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  } as ViewStyle,
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  label: { flex: 1, color: theme.colors.basic100 } as TextStyle,
});
