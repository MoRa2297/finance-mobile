import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { theme } from '@config/theme';
import { ROUTES } from '@config/constants';

import {
  getFieldError,
  initialFormValues,
  loginValidationSchema,
} from './LoginForm.helpers';
import { TLoginFormValues } from '@hooks/screens/login/useLogin';
import { InputField } from '@/components';
import { Button } from '@components/ui/Button';

interface ILoginFormProps {
  isLoading: boolean;
  errorMessage: string;
  onSubmit: (values: TLoginFormValues) => Promise<void>;
}

export const LoginForm: FC<ILoginFormProps> = ({
  isLoading,
  errorMessage,
  onSubmit,
}) => {
  const { t } = useTranslation(['loginPage']);

  const handleFormSubmit = async (
    values: TLoginFormValues,
    _helpers: FormikHelpers<TLoginFormValues>,
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
            {/* Inputs Container - gap fisso che non si comprime */}
            <View style={styles.inputsContainer}>
              {/* Email Field */}
              <View style={styles.fieldWrapper}>
                <InputField
                  placeholder={t('loginPage:form.emailPlaceholder')}
                  value={values.email}
                  textContentType="emailAddress"
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {emailError && (
                  <Text style={styles.fieldError}>{emailError}</Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.fieldWrapper}>
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
              </View>
            </View>

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
              // TODO use the correct function
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
  forgotPasswordContainer: {
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
