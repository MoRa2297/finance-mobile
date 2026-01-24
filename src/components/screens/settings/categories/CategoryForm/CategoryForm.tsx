import React, { useState, useCallback, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Alert,
  InputIconField,
  ColorInputField,
  IconInputField,
} from '@/components/ui';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Category } from '@/types';
import { useUIStore } from '@/stores';

export interface CategoryFormValues {
  id?: number;
  name: string;
  color: string;
  icon: string;
}

interface ICategoryFormProps {
  category: Category | null;
  onSubmit: (values: CategoryFormValues) => void;
  onClose: () => void;
}

export const CategoryForm: FC<ICategoryFormProps> = ({
  category,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // Form state
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(
    category?.categoryColor?.hexCode || '#5d4c86',
  );
  const [icon, setIcon] = useState(
    category?.categoryIcon?.iconName || 'cart-outline',
  );

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = useCallback(() => {
    // Validation
    if (!name.trim()) {
      setAlertMessage(t('categoriesPage:categoryForm.alertNameError'));
      setAlertVisible(true);
      return;
    }

    onSubmit({
      id: category?.id,
      name: name.trim(),
      color,
      icon,
    });
  }, [name, color, icon, category?.id, onSubmit, t]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text category="h4" style={styles.title}>
        {category
          ? t('categoriesPage:categoryForm.editCategory')
          : t('categoriesPage:categoryForm.newCategory')}
      </Text>

      {/* Form Fields */}
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
        />

        <IconInputField
          value={icon}
          onChange={setIcon}
          selectedColor={color}
          iconName="image-outline"
        />
      </View>

      {/* Buttons */}
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
        />
      </View>

      {/* Validation Alert */}
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
