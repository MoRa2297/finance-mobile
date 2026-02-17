import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, List } from '@ui-kitten/components';

import { theme } from '@config/theme';
import { GLOBAL_BORDER_RADIUS, SCREEN_HEIGHT } from '@config/constants';

import { Category } from '@/types';
import { useDataStore } from '@/stores';
import { selectCategories } from '@stores/data/data.selectors';
import { CategorySelectSheetListItem } from '@components/sheets/SelectCategorySheet/CategorySelectSheetListItem';

// =============================================================================
// TYPES
// =============================================================================

type CategoryType = 'income' | 'expenses';

interface SelectCategorySheetPayload {
  type: CategoryType;
}

interface SelectCategorySheetResult {
  item: Category;
}

type SelectCategorySheetProps = SheetProps<'select-category-sheet'>;

// =============================================================================
// CONSTANTS
// =============================================================================

const LIST_MAX_HEIGHT = SCREEN_HEIGHT / 1.5;
const LIST_MIN_HEIGHT = SCREEN_HEIGHT / 4;

// =============================================================================
// COMPONENT
// =============================================================================

export const SelectCategorySheet: React.FC<SelectCategorySheetProps> = ({
  payload,
}) => {
  // const { dataStore, sessionStore } = useStores();
  const categories = useDataStore(selectCategories);

  // const categories = useDataStore(state => state.categories);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const categoryType = payload?.type;

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  // useEffect(() => {
  //   const shouldFetchCategories = !categories?.length;
  //
  //   if (
  //     shouldFetchCategories &&
  //     sessionStore.sessionToken &&
  //     sessionStore.user?.id
  //   ) {
  //     dataStore.getCategories(sessionStore.sessionToken, sessionStore.user.id);
  //   }
  // }, [dataStore, sessionStore.sessionToken, sessionStore.user?.id]);

  // ---------------------------------------------------------------------------
  // Computed Values
  // ---------------------------------------------------------------------------

  const filteredCategories = useMemo(() => {
    if (!categories || !categoryType) return [];

    return categories.filter(category => category.type === categoryType);
  }, [categories, categoryType]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSelect = useCallback((item: Category) => {
    const result: SelectCategorySheetResult = { item };
    // actionSheetRef.current?.hide(result);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategorySelectSheetListItem
        item={item}
        onSelect={() => handleSelect(item)}
      />
    ),
    [handleSelect],
  );

  const renderSeparator = useCallback(
    () => <Layout style={styles.separator} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: Category, index: number) => item.id?.toString() ?? String(index),
    [],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
      </Layout>
    </ActionSheet>
  );
};

// =============================================================================
// STYLES
// =============================================================================

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
});
