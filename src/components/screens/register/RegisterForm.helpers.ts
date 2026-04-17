import * as Yup from 'yup';
import { TRegisterFormValues } from '@hooks/screens/register/useRegisterScreen';
import { i18n } from '@/i18n';

export const initialFormValues: TRegisterFormValues = {
  name: '',
  email: '',
  password: '',
};

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required(i18n.t('registerPage:errors.nameRequired')),
  email: Yup.string()
    .email(i18n.t('registerPage:errors.emailInvalid'))
    .required(i18n.t('registerPage:errors.emailRequired')),
  password: Yup.string()
    .required(i18n.t('registerPage:errors.passwordRequired'))
    .min(7, i18n.t('registerPage:errors.passwordMin'))
    .matches(/[0-9]/, i18n.t('registerPage:errors.passwordNumber'))
    .matches(/[a-z]/, i18n.t('registerPage:errors.passwordLowercase'))
    .matches(/[A-Z]/, i18n.t('registerPage:errors.passwordUppercase'))
    .matches(/[^\w]/, i18n.t('registerPage:errors.passwordSymbol')),
});

export const getFieldError = (
  field: keyof TRegisterFormValues,
  errors: Partial<TRegisterFormValues>,
  touched: Partial<Record<keyof TRegisterFormValues, boolean>>,
): string | undefined => {
  return touched[field] ? errors[field] : undefined;
};
