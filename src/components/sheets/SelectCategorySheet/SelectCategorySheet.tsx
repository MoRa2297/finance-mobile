import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  FlatList,
  TextStyle,
  useWindowDimensions,
} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@config/constants';
import { Category } from '@/types';
import { Icon } from '@components/ui/Icon';
import { EmptyData } from '@components/common';
import { useCategories } from '@stores/category';

type SelectCategorySheetProps = SheetProps<'select-category-sheet'>;

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
  const { t } = useTranslation(['categoriesPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { height } = useWindowDimensions();
  const { data: categories = [] } = useCategories();

  const filteredCategories = useMemo(() => {
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

  const keyExtractor = useCallback(
    (item: Category, i: number) => item.id?.toString() ?? `cat-${i}`,
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyData
        variant="centered"
        iconName="pricetags-outline"
        title={t('categoriesPage:empty.title')}
        subtitle={t('categoriesPage:empty.subtitle')}
      />
    ),
    [t],
  );

  const isEmpty = filteredCategories.length === 0;

  return (
    <ActionSheet
      id={sheetId}
      ref={actionSheetRef}
      closable
      gestureEnabled
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.sheetContainer}
      keyboardHandlerEnabled={false}>
      <View style={styles.content}>
        <Text category="h6" style={styles.title}>
          {t('categoriesPage:selectCategory')}
        </Text>

        <View style={{ minHeight: height * 0.3, maxHeight: height * 0.5 }}>
          <FlatList
            data={filteredCategories}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              isEmpty && styles.listContentEmpty,
            ]}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    overflow: 'hidden',
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  listItemPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  },
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, color: theme.colors.basic100 } as TextStyle,
});
