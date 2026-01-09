import * as Yup from 'yup';
import { FormikErrors, FormikTouched } from 'formik';

import { i18n } from '@/i18n';
import { LoginFormValues } from '@components/screens/login/LoginForm/LoginForm.types';

const t = (key: string) => i18n.t(key);

// ============ VALIDATION ============

const PASSWORD_RULES = {
  minLength: 7,
  patterns: {
    number: /[0-9]/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    symbol: /[^\w]/,
  },
} as const;

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(t('messages.formValidations.general.emailNotValid'))
    .required(t('messages.formValidations.general.required')),
  password: Yup.string()
    .required(t('messages.formValidations.general.required'))
    .min(PASSWORD_RULES.minLength, t('messages.formValidations.general.min7'))
    .matches(
      PASSWORD_RULES.patterns.number,
      t('messages.formValidations.general.number'),
    )
    .matches(
      PASSWORD_RULES.patterns.lowercase,
      t('messages.formValidations.general.lowercaseLetter'),
    )
    .matches(
      PASSWORD_RULES.patterns.uppercase,
      t('messages.formValidations.general.uppercaseLetter'),
    )
    .matches(
      PASSWORD_RULES.patterns.symbol,
      t('messages.formValidations.general.symbol'),
    ),
});

export const initialFormValues: LoginFormValues = {
  email: '',
  password: '',
};

// ============ FIELD HELPERS ============

export const getFieldError = (
  field: keyof LoginFormValues,
  errors: FormikErrors<LoginFormValues>,
  touched: FormikTouched<LoginFormValues>,
): string | undefined => {
  return touched[field] && errors[field] ? errors[field] : undefined;
};

export const canSubmit = (
  values: LoginFormValues,
  isLoading: boolean,
): boolean => {
  const hasEmail = values.email.trim().length > 0;
  const hasPassword = values.password.trim().length > 0;
  return hasEmail && hasPassword && !isLoading;
};
