import React, { useRef, useCallback, FC } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { useDataStore } from '@/stores';
import { COLORS } from '@/config';
import { CATEGORY_ICONS } from '@config/icons';
import { CategoryForm, CategoryFormValues } from '@components/screens/settings';

export const CategoryFormSheet: FC<SheetProps<'category-form-sheet'>> = ({
  payload,
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const addCategory = useDataStore(state => state.addCategory);
  const updateCategory = useDataStore(state => state.updateCategory);

  const handleSubmit = useCallback(
    (values: CategoryFormValues) => {
      // Find color and icon IDs
      const colorData = COLORS.find(c => c.hexCode === values.color);
      const iconData = CATEGORY_ICONS.find(i => i.iconName === values.icon);

      if (!colorData || !iconData || !payload?.type) {
        return;
      }

      const categoryData = {
        name: values.name,
        colorId: String(colorData.id),
        iconId: String(iconData.id),
        type: payload.type,
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
    [payload?.type, addCategory, updateCategory],
  );

  const handleClose = useCallback(() => {
    actionSheetRef.current?.hide();
  }, []);

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      closable
      gestureEnabled
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <CategoryForm
        category={payload?.category || null}
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
