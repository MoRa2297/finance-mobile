import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';

import { theme } from '@config/theme';
import { Button } from '@components/ui/Button';
import { InputField } from '@components/ui/InputField';
import { TRegisterFormValues } from '@hooks/screens/register/useRegisterScreen';
import {
  getFieldError,
  initialFormValues,
  registerValidationSchema,
} from './RegisterForm.helpers';

interface IRegisterFormProps {
  isLoading: boolean;
  onSubmit: (values: TRegisterFormValues) => Promise<void>;
  onClearError: () => void;
  errorMessage?: string;
}

export const RegisterForm: FC<IRegisterFormProps> = ({
  isLoading,
  errorMessage,
  onSubmit,
  onClearError,
}) => {
  const { t } = useTranslation(['registerPage', 'common']);

  const handleFormSubmit = async (
    values: TRegisterFormValues,
    _helpers: FormikHelpers<TRegisterFormValues>,
  ) => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleFormSubmit}
      validateOnBlur
      validateOnChange={false}>
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
      }) => {
        const nameError = getFieldError('name', errors, touched);
        const emailError = getFieldError('email', errors, touched);
        const passwordError = getFieldError('password', errors, touched);

        return (
          <Layout style={styles.container}>
            <View style={styles.inputsContainer}>
              {/* Name */}
              <View style={styles.fieldWrapper}>
                <InputField
                  placeholder={t('registerPage:form.namePlaceholder')}
                  value={values.name}
                  textContentType="name"
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  onFocus={onClearError}
                />
                {nameError && (
                  <Text style={styles.fieldError}>{nameError}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.fieldWrapper}>
                <InputField
                  placeholder={t('registerPage:form.emailPlaceholder')}
                  value={values.email}
                  textContentType="emailAddress"
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={onClearError}
                />
                {emailError && (
                  <Text style={styles.fieldError}>{emailError}</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.fieldWrapper}>
                <InputField
                  placeholder={t('registerPage:form.passwordPlaceholder')}
                  value={values.password}
                  textContentType="newPassword"
                  secureTextEntry
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onFocus={onClearError}
                />
                {passwordError && (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                )}
              </View>
            </View>

            {errorMessage && (
              <Text style={styles.apiError}>{errorMessage}</Text>
            )}

            <Button
              onPress={() => handleSubmit()}
              style={styles.submitButton}
              buttonText={t('registerPage:form.signUp')}
              textStyle={styles.submitButtonText}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </Layout>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    gap: 16,
  },
  inputsContainer: {
    gap: 12,
  },
  fieldWrapper: {
    gap: 4,
  },
  fieldError: {
    color: theme.colors.danger400,
    fontSize: 14,
    marginHorizontal: 8,
  },
  apiError: {
    color: theme.colors.danger400,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: theme.colors.basic100,
    height: 55,
  },
  submitButtonText: {
    color: theme.colors.black,
    fontWeight: '700',
  },
});
