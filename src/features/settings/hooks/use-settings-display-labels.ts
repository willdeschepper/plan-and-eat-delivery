import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { useSelectedLanguage } from '@/lib/i18n';

import { SETTINGS_LANGUAGE_OPTIONS } from '../lib/settings-language-options';
import { SETTINGS_THEME_OPTIONS } from '../lib/settings-theme-options';

export function useSettingsDisplayLabels(): {
  languageLabel: string;
  themeLabel: string;
} {
  const { t } = useTranslation();
  const { language } = useSelectedLanguage();
  const { selectedTheme } = useSelectedTheme();

  const languageLabel = React.useMemo(() => {
    const option = SETTINGS_LANGUAGE_OPTIONS.find(o => o.value === language);
    return option ? t(option.labelTx) : '';
  }, [language, t]);

  const themeLabel = React.useMemo(() => {
    const option = SETTINGS_THEME_OPTIONS.find(o => o.value === selectedTheme);
    return option ? t(option.labelTx) : '';
  }, [selectedTheme, t]);

  return { languageLabel, themeLabel };
}
