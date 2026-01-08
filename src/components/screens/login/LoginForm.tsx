import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button, InputField } from '@/components/ui';
import { theme } from '@/config/theme';
// import { LoginFormValues } from '@/features/auth/validation/auth.schema';

export type LoginFormValues = {
  email: string;
  password: string;
};

interface LoginFormProps {
  initialValues: LoginFormValues;
  validationSchema: Yup.ObjectSchema<LoginFormValues>;
  isLoading: boolean;
  errorMessage: string;
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  initialValues,
  validationSchema,
  isLoading,
  errorMessage,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const handleFormSubmit = async (
    values: LoginFormValues,
    _helpers: FormikHelpers<LoginFormValues>,
  ) => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      validateOnBlur={true}
      validateOnChange={false}>
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
      }) => (
        <Layout style={styles.container}>
          {/* Email Field */}
          <InputField
            placeholder={t('screens.loginScreen.emailPlaceholder')}
            value={values.email}
            textContentType="emailAddress"
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            autoCapitalize="none"
            keyboardType="email-address"
            error={touched.email && errors.email ? errors.email : undefined}
          />

          {/* Password Field */}
          <InputField
            placeholder={t('screens.loginScreen.passwordPlaceholder')}
            value={values.password}
            textContentType="password"
            secureTextEntry
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            error={
              touched.password && errors.password ? errors.password : undefined
            }
          />

          {/* API Error */}
          {errorMessage ? (
            <Text style={styles.apiError}>{errorMessage}</Text>
          ) : null}

          {/* Forgot Password */}
          <Layout style={styles.forgotPasswordContainer}>
            <Text category="s1" style={styles.linkText}>
              {t('screens.loginScreen.forgotPassword')}
            </Text>
          </Layout>

          {/* Submit Button */}
          <Button
            onPress={() => handleSubmit()}
            style={styles.submitButton}
            buttonText={t('screens.loginScreen.signIn')}
            textStyle={styles.submitButtonText}
            isLoading={isLoading}
            isDisabled={isLoading}
          />
        </Layout>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  forgotPasswordContainer: {
    marginVertical: 20,
    backgroundColor: theme.colors.transparent,
  },
  linkText: {
    color: theme.colors.primary,
  },
  apiError: {
    color: theme.colors.danger400,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
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
