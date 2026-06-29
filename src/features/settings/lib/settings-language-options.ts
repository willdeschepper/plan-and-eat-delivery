import type { Language } from '@/lib/i18n/resources';
import type { TxKeyPath } from '@/lib/i18n';

export type SettingsLanguageOption = {
  value: Language;
  labelTx: TxKeyPath;
};

export const SETTINGS_LANGUAGE_OPTIONS: SettingsLanguageOption[] = [
  { value: 'en', labelTx: 'settings.english' },
  { value: 'ru', labelTx: 'settings.russian' },
  { value: 'az', labelTx: 'settings.azerbaijani' },
];
