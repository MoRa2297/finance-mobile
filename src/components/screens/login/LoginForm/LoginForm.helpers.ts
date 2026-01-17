import * as Yup from 'yup';
import { FormikErrors, FormikTouched } from 'formik';

import { i18n } from '@/i18n';
import { TLoginFormValues } from '@hooks/screens/login/useLogin';

const t = (key: string) => i18n.t(key);

const PASSWORD_RULES = {
  minLength: 7,
  patterns: {
    number: /[0-9]/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    symbol: /[^\w]/,
  },
} as const;

export const initialFormValues: TLoginFormValues = {
  email: '',
  password: '',
};

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(t('validation:emailNotValid'))
    .required(t('validation:required')),
  password: Yup.string()
    .required(t('validation:required'))
    .min(PASSWORD_RULES.minLength, t('validation:min7'))
    .matches(PASSWORD_RULES.patterns.number, t('validation:number'))
    .matches(PASSWORD_RULES.patterns.lowercase, t('validation:lowercaseLetter'))
    .matches(PASSWORD_RULES.patterns.uppercase, t('validation:uppercaseLetter'))
    .matches(PASSWORD_RULES.patterns.symbol, t('validation:symbol')),
});

export const getFieldError = (
  field: keyof TLoginFormValues,
  errors: FormikErrors<TLoginFormValues>,
  touched: FormikTouched<TLoginFormValues>,
): string | undefined => {
  return touched[field] && errors[field] ? errors[field] : undefined;
};

export const canSubmit = (
  values: TLoginFormValues,
  isLoading: boolean,
): boolean => {
  const hasEmail = values.email.trim().length > 0;
  const hasPassword = values.password.trim().length > 0;
  return hasEmail && hasPassword && !isLoading;
};
