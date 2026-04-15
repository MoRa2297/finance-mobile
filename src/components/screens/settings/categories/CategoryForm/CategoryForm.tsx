import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Category, Color, CategoryIcon, CategoryType } from '@/types';
import { useUIStore } from '@/stores';
import { InputIconField } from '@components/ui/InputIconField';
import { ColorInputField } from '@components/ui/ColorInputField';
import { IconInputField } from '@components/ui/IconInputField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { useCategoryForm } from '@hooks/screens/categories';

interface CategoryFormProps {
  category: Category | null;
  type: CategoryType;
  colors: Color[];
  categoryIcons: CategoryIcon[];
  onClose: () => void;
}

export const CategoryForm: FC<CategoryFormProps> = props => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const {
    state,
    isSubmitting,
    selectedColor,
    selectedIcon,
    set,
    handleColorChange,
    handleIconChange,
    handleSubmit,
  } = useCategoryForm(props);

  return (
    <View style={styles.container}>
      <Text category="h4" style={styles.title}>
        {props.category
          ? t('categoriesPage:categoryForm.editCategory')
          : t('categoriesPage:categoryForm.newCategory')}
      </Text>

      <View style={styles.form}>
        <InputIconField
          placeholder={t('categoriesPage:categoryForm.namePlaceholder')}
          value={state.name}
          onChange={v => set({ name: v })}
          iconName="edit-outline"
        />
        <ColorInputField
          value={selectedColor}
          onChange={handleColorChange}
          iconName="color-palette-outline"
          colors={props.colors}
        />
        <IconInputField
          value={selectedIcon}
          onChange={handleIconChange}
          selectedColor={selectedColor}
          iconName="image-outline"
          categoryIcons={props.categoryIcons}
        />
      </View>

      <View style={[styles.buttonContainer, { marginBottom: bottomTabHeight }]}>
        <Button
          size="small"
          buttonText={t('common:cancel')}
          style={styles.button}
          appearance="outline"
          onPress={props.onClose}
        />
        <Button
          size="small"
          buttonText={t('common:save')}
          style={styles.button}
          backgroundColor={theme.colors.primary}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </View>

      <Alert
        visible={!!state.alertMessage}
        title={t('categoriesPage:categoryForm.alertTitle')}
        subtitle={state.alertMessage ?? ''}
        primaryButtonText={t('categoriesPage:categoryForm.alertButtonText')}
        onPrimaryPress={() => set({ alertMessage: null })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: HORIZONTAL_PADDING, marginTop: 25 },
  title: { fontWeight: '500', color: theme.colors.basic100, marginBottom: 10 },
  form: { gap: 5 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
    gap: 15,
  },
  button: { flex: 1, borderRadius: GLOBAL_BORDER_RADIUS },
});
