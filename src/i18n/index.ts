import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import it from './it';
import en from './en';
import commonEn from './en/common.json';
import commonIt from './it/common.json';

import loginEn from './en/loginPage.json';
import loginIt from './it/loginPage.json';

import homeIt from './it/homePage.json';
import homeEn from './en/homePage.json';

import expensesIt from './it/expensesPage.json';
import expensesEn from './en/expensesPage.json';

import settingsIt from './it/settingsPage.json';
import settingsEn from './en/settingsPage.json';

import categoriesIt from './it/categoriesPage.json';
import categoriesEn from './en/categoriesPage.json';

import bankAccountsIt from './it/bankAccountsPage.json';
import bankAccountsEn from './en/bankAccountsPage.json';

import validationEn from './en/validation.json';
import validationIt from './it/validation.json';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const DEFAULT_LANG = 'en';

const i18nResources = {
  it: {
    common: commonIt,
    loginPage: loginIt,
    homePage: homeIt,
    expensesPage: expensesIt,
    settingsPage: settingsIt,
    categoriesPage: categoriesIt,
    bankAccountPage: bankAccountsIt,
    validation: validationIt,
    // translation: it,
  },
  en: {
    common: commonEn,
    loginPage: loginEn,
    homePage: homeEn,
    expensesPage: expensesEn,
    settingsPage: settingsEn,
    categoriesPage: categoriesEn,
    bankAccountPage: bankAccountsEn,
    validation: validationEn,
    // translation: en,
  },
};

/**
 * Gets preferred system locale code, country code and phone prefix.
 * If not found fallback to defaults.
 */
const getSystemLocale = () => {
  const locales = Localization.getLocales();
  const lang =
    locales.length < 1 ? DEFAULT_LANG : (locales[0].languageCode as I18NLang);

  return {
    lang,
  };
};

export type I18NLang = keyof typeof i18nResources;

i18next
  .use({
    // Dumb languageDetector just to stop some annoying console warnings
    type: 'languageDetector',
    async: true,
    init: () => {},
    detect: async (cb: (language: string) => void) => {
      const locale = getSystemLocale();
      try {
        const language = await AsyncStorage.getItem('language');
        cb(language || locale.lang);
      } catch (err) {
        cb(locale.lang);
      }
    },
    cacheUserLanguage: (language: string) => {
      AsyncStorage.setItem('language', language);
    },
  })
  .use(initReactI18next)
  .init({
    ns: [
      'common',
      'validation',
      'loginPage',
      'expensesPage',
      'settingsPage',
      'categoriesPage',
      'bankAccountPage',
    ],
    // TODO compatibilityJSON: 'v3',
    fallbackLng: DEFAULT_LANG,
    resources: i18nResources,
    debug: false,
    defaultNS: 'common', // default namespace
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export const i18n = i18next;
