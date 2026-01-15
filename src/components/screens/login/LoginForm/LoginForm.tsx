import React, { FC } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';

import { Button, InputField } from '@/components/ui';

import {
  getFieldError,
  initialFormValues,
  loginValidationSchema,
} from './LoginForm.helpers';
import { StyleSheet } from 'react-native';
import { theme } from '@config/theme';
import { router } from 'expo-router';
import { ROUTES } from '@config/constants';

export type LoginFormValues = {
  email: string;
  password: string;
};

interface ILoginFormProps {
  isLoading: boolean;
  errorMessage: string;
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm: FC<ILoginFormProps> = ({
  isLoading,
  errorMessage,
  onSubmit,
}) => {
  const { t } = useTranslation(['loginPage']);

  const handleFormSubmit = async (
    values: LoginFormValues,
    _helpers: FormikHelpers<LoginFormValues>,
  ) => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={loginValidationSchema}
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
        const emailError = getFieldError('email', errors, touched);
        const passwordError = getFieldError('password', errors, touched);

        return (
          <Layout style={styles.container}>
            {/* Email Field */}
            <InputField
              placeholder={t('loginPage:form.emailPlaceholder')}
              value={values.email}
              textContentType="emailAddress"
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError && <Text style={styles.fieldError}>{emailError}</Text>}

            {/* Password Field */}
            <InputField
              placeholder={t('loginPage:form.passwordPlaceholder')}
              value={values.password}
              textContentType="password"
              secureTextEntry
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {passwordError && (
              <Text style={styles.fieldError}>{passwordError}</Text>
            )}

            {/* API Error */}
            {errorMessage && (
              <Text style={styles.apiError}>{errorMessage}</Text>
            )}

            {/* Forgot Password */}
            <Layout style={styles.forgotPasswordContainer}>
              <Text category="s1" style={styles.linkText}>
                {t('loginPage:form.forgotPassword')}
              </Text>
            </Layout>

            {/* Submit Button */}
            <Button
              // onPress={() => handleSubmit()}
              onPress={() => router.replace(ROUTES.HOME)}
              style={styles.submitButton}
              buttonText={t('loginPage:form.signIn')}
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

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  fieldError: {
    color: theme.colors.danger400,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  apiError: {
    color: theme.colors.danger400,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 12,
  },
  forgotPasswordContainer: {
    marginVertical: 20,
    backgroundColor: theme.colors.transparent,
  },
  linkText: {
    color: theme.colors.primary,
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
