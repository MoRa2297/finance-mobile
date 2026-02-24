import React, { useRef, useCallback, FC } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { useCategoryStore, useLookupStore, lookupSelectors } from '@/stores';
import { CategoryForm, CategoryFormValues } from '@components/screens/settings';

export const CategoryFormSheet: FC<SheetProps<'category-form-sheet'>> = ({
  payload,
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  // Store
  const createCategory = useCategoryStore(state => state.createCategory);
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const colors = useLookupStore(lookupSelectors.colors);
  const categoryIcons = useLookupStore(lookupSelectors.categoryIcons);

  const handleSubmit = useCallback(
    async (values: CategoryFormValues) => {
      const colorData = colors.find(c => c.hexCode === values.color);
      const iconData = categoryIcons.find(i => i.iconName === values.icon);

      if (!colorData || !iconData || !payload?.type) return;

      try {
        if (values.id) {
          await updateCategory(values.id, {
            name: values.name,
            colorId: colorData.id,
            iconId: iconData.id,
            type: payload.type,
          });
        } else {
          await createCategory({
            name: values.name,
            colorId: colorData.id,
            iconId: iconData.id,
            type: payload.type,
          });
        }
        actionSheetRef.current?.hide();
      } catch (error) {
        // Errore gestito nello store
      }
    },
    [payload?.type, colors, categoryIcons, createCategory, updateCategory],
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
        colors={colors}
        categoryIcons={categoryIcons}
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
