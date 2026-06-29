import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/lib/hooks/use-app-theme';
import { useSelectedLanguage } from '@/lib/i18n';

import { LanguageOptionRow } from '../components/language-option-row';
import { SettingsSubScreenLayout } from '../components/settings-sub-screen-layout';
import { SETTINGS_LANGUAGE_OPTIONS } from '../lib/settings-language-options';

export function LanguageScreen() {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const { language, setLanguage } = useSelectedLanguage();

  const handleSelect = React.useCallback(
    (value: typeof language) => {
      if (value === language) return;
      setLanguage(value);
    },
    [language, setLanguage],
  );

  return (
    <SettingsSubScreenLayout titleTx="settings.language">
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        {SETTINGS_LANGUAGE_OPTIONS.map((option, index) => (
          <LanguageOptionRow
            key={option.value}
            label={t(option.labelTx)}
            value={option.value}
            selected={language === option.value}
            onPress={handleSelect}
            isLast={index === SETTINGS_LANGUAGE_OPTIONS.length - 1}
            testID={`settings-language-option-${option.value}`}
          />
        ))}
      </View>
    </SettingsSubScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
