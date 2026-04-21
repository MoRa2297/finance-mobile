import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';

import { LanguageCode, LANGUAGES } from '@/config';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage =
    LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  const changeLanguage = useCallback(
    async (code: LanguageCode) => {
      await i18n.changeLanguage(code);
    },
    [i18n],
  );

  const openLanguageSheet = useCallback(async () => {
    const result = await SheetManager.show('language-sheet', {
      payload: { currentLanguage: currentLanguage.code },
    });

    if (result?.code) {
      await changeLanguage(result.code);
    }
  }, [currentLanguage.code, changeLanguage]);

  return {
    currentLanguage,
    openLanguageSheet,
  };
};
