import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '../../../../config/constants';
import { Category } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';
import { Layout, List } from '@ui-kitten/components';
import { CategorySelectSheetListItem } from '../CategorySelectSheetListItem/CategorySelectSheetListItem';

type SelectCategorySheetProps = {
  payload: {
    type: 'income' | 'expenses';
  };
  sheetId: string;
};

export const SelectCategorySheet: React.FunctionComponent<
  SheetProps<SelectCategorySheetProps>
> = ({ payload }) => {
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onSelect = (item: Category) => {
    actionSheetRef.current?.hide({ item });
  };

  const filteredCategory = useMemo(() => {
    return dataStore.categories.filter(
      category => category.type === payload?.type,
    );
  }, [dataStore.categories, payload?.type]);

  useEffect(() => {
    if (!dataStore.categories) {
      dataStore.getCategories(sessionStore.sessionToken, sessionStore.user?.id);
    }
  }, [dataStore, sessionStore.sessionToken, sessionStore.user?.id]);

  return (
    <ActionSheet
      drawUnderStatusBar={true}
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.containerStyle}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <List
          data={filteredCategory}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <CategorySelectSheetListItem
              item={item}
              onSelect={() => {
                onSelect(item);
              }}
            />
          )}
          ItemSeparatorComponent={() => <Layout style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            maxHeight: SCREEN_HEIGHT / 1.5,
            minHeight: SCREEN_HEIGHT / 4,
            backgroundColor: theme['color-primary-BK'],
          }}
        />
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  container: {
    paddingTop: 25,
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    fontSize: 17,
    backgroundColor: theme['color-primary-BK'],
    paddingVertical: 10,
    color: theme['text-hint-color'],
  },
  separator: {
    height: 0,
    backgroundColor: theme['color-primary-BK'],
  },
});
