import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';

import { SettingsSubScreenLayout } from '../components/settings-sub-screen-layout';
import { ThemeOptionRow } from '../components/theme-option-row';
import { SETTINGS_THEME_OPTIONS } from '../lib/settings-theme-options';

export function ThemeScreen() {
  const { t } = useTranslation();
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  const handleSelect = React.useCallback(
    (value: ColorSchemeType) => {
      if (value === selectedTheme) return;
      setSelectedTheme(value);
    },
    [selectedTheme, setSelectedTheme],
  );

  return (
    <SettingsSubScreenLayout titleTx="settings.theme.title">
      <View style={styles.list}>
        {SETTINGS_THEME_OPTIONS.map(option => (
          <ThemeOptionRow
            key={option.value}
            label={t(option.labelTx)}
            value={option.value}
            selected={selectedTheme === option.value}
            icon={option.icon}
            onPress={handleSelect}
            testID={`settings-theme-option-${option.value}`}
          />
        ))}
      </View>
    </SettingsSubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
});
