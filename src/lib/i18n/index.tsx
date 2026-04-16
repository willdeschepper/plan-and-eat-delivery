/* eslint-disable react-refresh/only-export-components */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { resources } from './resources';
import { getLanguage } from './utils';

export * from './utils';

// M4-F: supported language codes — must match keys in resources.
const SUPPORTED_LANGUAGES = ['en', 'ru', 'az'] as const;

// M4-F: normalize device locale tag to a supported base code.
// Examples: 'ru-RU' → 'ru', 'fr-FR' → 'en' (unsupported → fallback).
function normalizeLocale(tag: string | undefined): string {
  if (!tag)
    return 'en';
  const base = tag.split('-')[0]?.toLowerCase() ?? 'en';
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base) ? base : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage() ?? normalizeLocale(getLocales()[0]?.languageTag),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

// Is it a RTL language?
export const isRTL: boolean = i18n.dir() === 'rtl';

// M4-H: en/ru/az are all LTR. If adding an RTL language (e.g. Arabic),
// verify allowRTL(true) and audit all layout/flex styles for RTL support.
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export default i18n;
