import React, { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import {
  CategoryForm,
  CategoryFormValues,
} from '@/components/screens/settings/categories/CategoryForm';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { useDataStore } from '@/stores';
import { CATEGORY_ICONS, COLORS } from '@/config';

export const CategoryFormSheet: React.FC<
  SheetProps<'category-form-sheet'>
> = props => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const addCategory = useDataStore(state => state.addCategory);
  const updateCategory = useDataStore(state => state.updateCategory);

  const handleSubmit = useCallback(
    (values: CategoryFormValues) => {
      // Find color and icon IDs
      const colorData = COLORS.find(c => c.hexCode === values.color);
      const iconData = CATEGORY_ICONS.find(i => i.iconName === values.icon);

      if (!colorData || !iconData || !props.payload?.type) {
        return;
      }

      const categoryData = {
        name: values.name,
        colorId: String(colorData.id),
        iconId: String(iconData.id),
        type: props.payload.type,
        categoryColor: { id: colorData.id, hexCode: colorData.hexCode },
        categoryIcon: { id: iconData.id, iconName: iconData.iconName },
      };

      if (values.id) {
        // Update existing
        updateCategory(values.id, categoryData);
      } else {
        // Create new
        const newCategory = {
          id: Date.now(), // Temporary ID for mock
          userId: 1,
          ...categoryData,
        };
        addCategory(newCategory);
      }

      actionSheetRef.current?.hide();
    },
    [props.payload?.type, addCategory, updateCategory],
  );

  const handleClose = useCallback(() => {
    actionSheetRef.current?.hide();
  }, []);

  console.log('CIAOOOO');

  return (
    <ActionSheet
      ref={actionSheetRef}
      // id={props.sheetId}
      id={'category-form-sheet'}
      closable
      gestureEnabled
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <CategoryForm
        category={props.payload?.category || null}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
});
