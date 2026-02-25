import React, { useState, useCallback, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Category, Color, CategoryIcon } from '@/types';
import { useUIStore } from '@/stores';
import { InputIconField } from '@components/ui/InputIconField';
import { ColorInputField } from '@components/ui/ColorInputField';
import { IconInputField } from '@components/ui/IconInputField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';

export interface CategoryFormValues {
  id?: number;
  name: string;
  color: string;
  icon: string;
}

interface ICategoryFormProps {
  category: Category | null;
  colors: Color[];
  categoryIcons: CategoryIcon[];
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onClose: () => void;
}

export const CategoryForm: FC<ICategoryFormProps> = ({
  category,
  colors,
  categoryIcons,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(
    category?.categoryColor?.hexCode || colors[0]?.hexCode || '#5d4c86',
  );
  const [icon, setIcon] = useState(
    category?.categoryIcon?.iconName ||
      categoryIcons[0]?.iconName ||
      'cart-outline',
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      setAlertMessage(t('categoriesPage:categoryForm.alertNameError'));
      setAlertVisible(true);
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      id: category?.id,
      name: name.trim(),
      color,
      icon,
    });
    setIsSubmitting(false);
  }, [name, color, icon, category?.id, onSubmit, t]);

  return (
    <View style={styles.container}>
      <Text category="h4" style={styles.title}>
        {category
          ? t('categoriesPage:categoryForm.editCategory')
          : t('categoriesPage:categoryForm.newCategory')}
      </Text>

      <View style={styles.form}>
        <InputIconField
          placeholder={t('categoriesPage:categoryForm.namePlaceholder')}
          value={name}
          onChange={setName}
          iconName="edit-outline"
        />

        <ColorInputField
          value={color}
          onChange={setColor}
          iconName="color-palette-outline"
          colors={colors}
        />

        <IconInputField
          value={icon}
          onChange={setIcon}
          selectedColor={color}
          iconName="image-outline"
          categoryIcons={categoryIcons}
        />
      </View>

      <View style={[styles.buttonContainer, { marginBottom: bottomTabHeight }]}>
        <Button
          size="small"
          buttonText={t('common:cancel')}
          style={styles.button}
          appearance="outline"
          onPress={onClose}
        />
        <Button
          size="small"
          buttonText={t('common:save')}
          style={styles.button}
          backgroundColor={theme.colors.primary}
          onPress={handleSubmit}
          isLoading={isSubmitting}
        />
      </View>

      <Alert
        visible={alertVisible}
        title={t('categoriesPage:categoryForm.alertTitle')}
        subtitle={alertMessage}
        primaryButtonText={t('categoriesPage:categoryForm.alertButtonText')}
        onPrimaryPress={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 25,
  },
  title: {
    fontWeight: '500',
    color: theme.colors.basic100,
    marginBottom: 10,
  },
  form: {
    gap: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
    gap: 15,
  },
  button: {
    flex: 1,
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
