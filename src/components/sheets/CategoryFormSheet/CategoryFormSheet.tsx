import React, { useRef, useCallback, FC } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { CategoryForm } from '@components/screens/settings';
import { useCategoryIcons, useColors } from '@stores/lookup';

export const CategoryFormSheet: FC<SheetProps<'category-form-sheet'>> = ({
  payload,
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const { data: colors = [] } = useColors();
  const { data: categoryIcons = [] } = useCategoryIcons();

  const handleClose = useCallback(() => {
    actionSheetRef.current?.hide();
  }, []);

  if (!payload?.type) return null;

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      closable
      gestureEnabled
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <CategoryForm
        category={payload.category ?? null}
        type={payload.type}
        colors={colors}
        categoryIcons={categoryIcons}
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
