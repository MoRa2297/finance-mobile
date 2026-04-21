import { I18NLang } from '@/i18n';

export const LANGUAGES = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const satisfies ReadonlyArray<{
  code: I18NLang;
  label: string;
  flag: string;
}>;

export type LanguageCode = I18NLang;
