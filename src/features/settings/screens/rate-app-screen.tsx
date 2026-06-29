import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { RateAppStarRating } from '../components/rate-app-star-rating';
import { SettingsSubScreenLayout } from '../components/settings-sub-screen-layout';
import { useRateAppScreenController } from '../hooks/use-rate-app-screen-controller';

export function RateAppScreen() {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const { rating, handleSelectRating } = useRateAppScreenController();

  return (
    <SettingsSubScreenLayout titleTx="settings.rate">
      <View style={styles.content}>
        <View style={styles.description}>
          <Text style={[styles.descriptionLine, { color: c.textSecondary }]}>
            {t('settings.rate_app_page.description_line_1')}
          </Text>
          <Text style={[styles.descriptionLine, { color: c.textSecondary }]}>
            {t('settings.rate_app_page.description_line_2')}
          </Text>
        </View>
        <RateAppStarRating rating={rating} onSelectRating={handleSelectRating} />
      </View>
    </SettingsSubScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 32,
    alignItems: 'center',
  },
  description: {
    alignItems: 'center',
    gap: 4,
  },
  descriptionLine: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
