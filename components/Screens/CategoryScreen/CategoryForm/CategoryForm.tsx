import { Layout, Text } from '@ui-kitten/components';
import { Formik } from 'formik';
import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { ColorInputField } from '../../../UI/ColorInputField/ColorInputField';
import { Button } from '../../../UI/Button/Button';
import { InputIconField } from '../../../UI/InputIconField/InputIconField';
import { useTranslation } from 'react-i18next';
import { IconInputField } from '../../../UI/IconInputField/IconInputField';
import { theme } from '../../../../config/theme';
import { Alert } from '../../../common/Alert/Alert';
import { Category, CategoryIcon, Color } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';

interface CategoryFormProps {
  category: Category | null;
  handleSubmitForm: (value: CategoryFormValues) => void;
  handleCloseForm: () => void;
  colors?: Color[];
  icons?: CategoryIcon[];
  submitError?: string;
}

export type CategoryFormValues = {
  id: number | undefined;
  name: string;
  color: string;
  icon: string;
};

export const CategoryForm: React.FunctionComponent<CategoryFormProps> = ({
  category,
  handleSubmitForm,
  handleCloseForm,
  colors,
  icons,
  submitError,
}) => {
  const { t } = useTranslation();
  const { ui } = useStores();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>(
    t<string>('components.categoryForm.alertTitle'),
  );
  const [alertSubTitle, setAlertSubTitle] = useState<string>('');
  const [alertButtonText, setAlertButtonText] = useState<string>('');

  const onValidate = useCallback(
    (values: { name: any }) => {
      let errors: any = {};

      if (!values.name) {
        setAlertSubTitle(t<string>('components.categoryForm.alertNameError'));
        setAlertButtonText(
          t<string>('components.categoryForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.name = 'Required';
      }
      return errors;
    },
    [t],
  );

  const handleCloseAlert = useCallback(() => {
    setIsAlertVisible(false);
  }, []);

  const handleSubmitForm_ = useCallback(
    (values: any) => {
      handleSubmitForm(values);
    },
    [handleSubmitForm],
  );

  return (
    <Layout style={styles.container}>
      <Text
        category="h4"
        style={{ fontWeight: '500', marginHorizontal: HORIZONTAL_PADDING }}>
        {category
          ? t<string>('components.categoryForm.editCategory')
          : t<string>('components.categoryForm.newCategory')}
      </Text>
      <Formik
        validateOnChange={false}
        initialValues={{
          id: category?.id || '', // set first element
          name: category?.name || '', // set first element
          color: category?.categoryColor.hexCode || '#5d4c86', // set first element
          icon: category?.categoryIcon.iconName || 'accessibility-outline', // set first element
        }}
        validate={onValidate}
        onSubmit={values => {
          handleSubmitForm_(values);
        }}>
        {({ handleChange, values, handleSubmit }) => (
          <Layout>
            <InputIconField
              placeholder={t<string>('components.categoryForm.namePlaceholder')}
              onChange={handleChange('name')}
              value={values.name}
              iconName={'edit-outline'}
            />
            <ColorInputField
              onChange={handleChange('color')}
              value={values.color}
              iconName={'color-palette-outline'}
              colors={colors}
            />
            <IconInputField
              selectedColor={values.color}
              onChange={handleChange('icon')}
              value={values.icon}
              iconName={'image-outline'}
              icons={icons}
            />
            <Layout
              style={[
                styles.buttonContainer,
                { marginBottom: ui.bottomTabHeight },
              ]}>
              <Button
                size="small"
                numberOfLines={1}
                appearance="outline"
                borderColor={theme['color-primary']}
                textStyle={{ color: theme['color-primary'] }}
                style={styles.button}
                onPress={handleCloseForm}
                buttonText={t<string>('common.delete')}
              />
              <Button
                size="small"
                style={styles.button}
                backgroundColor={theme['color-primary']}
                borderColor={theme['color-primary']}
                textStyle={{ color: theme['color-basic-100'] }}
                onPress={handleSubmit}
                buttonText={t<string>('common.save')}
              />
            </Layout>
          </Layout>
        )}
      </Formik>
      <Alert
        visible={isAlertVisible}
        title={alertTitle}
        subTitle={alertSubTitle}
        buttonTextPrimary={alertButtonText}
        handlePrimary={handleCloseAlert}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 25,
  },
  keyboardAvoidingView: {
    height: 'auto',
  },
  buttonContainer: {
    marginTop: '25%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: '40%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
