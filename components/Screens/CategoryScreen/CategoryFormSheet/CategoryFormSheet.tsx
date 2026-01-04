import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { CategoryForm, CategoryFormValues } from '../CategoryForm/CategoryForm';
import { theme } from '../../../../config/theme';
import { GLOBAL_BORDER_RADIUS } from '../../../../config/constants';
import { Category, EditCategory } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';
import { useTranslation } from 'react-i18next';

type CategoryFormSheetProps = {
  payload: {
    category: Category | null;
    type: 'income' | 'expenses';
  };
  sheetId: string;
};

export const CategoryFormSheet: React.FunctionComponent<
  SheetProps<CategoryFormSheetProps>
> = ({ payload }) => {
  const { t } = useTranslation();
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = useCallback(
    (values: CategoryFormValues) => {
      try {
        // Normalize data
        // COLOR
        const colorSelected = dataStore.colors?.find(
          color => color.hexCode === values.color,
        );

        // ICON
        const iconSelected = dataStore.categoryIcon?.find(
          icon => icon.iconName === values.icon,
        );

        // Handle all general error
        if (
          !colorSelected ||
          !iconSelected ||
          !sessionStore.sessionToken ||
          !payload ||
          !payload.type ||
          !sessionStore.user ||
          !sessionStore.user?.id
        ) {
          throw new Error('Errore');
        }

        const formDataFormatted: EditCategory = {
          id: values.id,
          name: values.name,
          colorId: colorSelected?.id,
          iconId: iconSelected?.id,
          type: payload.type,
          userId: sessionStore.user?.id,
        };

        if (values.id) {
          dataStore.updateCategory(
            sessionStore.sessionToken,
            formDataFormatted,
          );
        } else {
          dataStore.createCategory(
            sessionStore.sessionToken,
            formDataFormatted,
          );
        }

        actionSheetRef.current?.hide();
      } catch (error: any) {
        if (error.error === 'UNAUTHORIZED') {
          setSubmitError(t<string>('messages.apiErrors.unauthorizedError'));
        } else if (error.error === 'TRY_AGAIN') {
          if (error.error.details) {
            setSubmitError(error.error.details);
          } else {
            setSubmitError(t<string>('messages.apiErrors.tryAgainError'));
          }
        } else {
          setSubmitError(t<string>('messages.apiErrors.genericError'));
        }
      }
    },
    [dataStore, payload, sessionStore.sessionToken, sessionStore.user, t],
  );

  const handleClose = useCallback(() => {
    actionSheetRef.current?.hide();
  }, []);

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
      <CategoryForm
        category={payload?.category || null}
        handleSubmitForm={handleSubmit}
        handleCloseForm={handleClose}
        colors={dataStore.colors}
        icons={dataStore.categoryIcon}
        submitError={submitError}
      />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
});
