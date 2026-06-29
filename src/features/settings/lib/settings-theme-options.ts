import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme';
import type { TxKeyPath } from '@/lib/i18n';

export type SettingsThemeOption = {
  value: ColorSchemeType;
  labelTx: TxKeyPath;
  icon: 'sun' | 'moon' | 'system';
};

export const SETTINGS_THEME_OPTIONS: SettingsThemeOption[] = [
  { value: 'light', labelTx: 'settings.theme.light', icon: 'sun' },
  { value: 'dark', labelTx: 'settings.theme.dark', icon: 'moon' },
  { value: 'system', labelTx: 'settings.theme.system', icon: 'system' },
];
