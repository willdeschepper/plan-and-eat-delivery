import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusAwareStatusBar } from '@/components/ui';
import { USE_COURIER_API_ORDERS } from '@/features/courier/config';
import { useCourierProfile } from '@/features/courier/api';
import { MOCK_COURIER_PROFILE_DTO } from '@/features/orders/mock-data';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const insets = useSafeAreaInsets();
  const apiProfile = useCourierProfile();
  const profile = USE_COURIER_API_ORDERS ? apiProfile.data : MOCK_COURIER_PROFILE_DTO;
  const isLoading = USE_COURIER_API_ORDERS ? apiProfile.isLoading : false;
  const isError = USE_COURIER_API_ORDERS ? apiProfile.isError : false;

  return (
    <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top + 24 }]}>
      <FocusAwareStatusBar />
      <Text style={[styles.title, { color: c.textPrimary }]}>
        {t('courier.profile.title')}
      </Text>

      {isLoading && (
        <View style={styles.stateBlock}>
          <ActivityIndicator color="#FF6C00" />
          <Text style={[styles.stateText, { color: c.textSecondary }]}>
            {t('courier.profile.loading')}
          </Text>
        </View>
      )}

      {isError && !isLoading && (
        <Text style={[styles.stateText, { color: c.textSecondary }]}>
          {t('courier.profile.load_failed')}
        </Text>
      )}

      {profile && !isLoading && (
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.name, { color: c.textPrimary }]}>
            {`${profile.name} ${profile.surname}`.trim()}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: c.textSecondary }]}>
              {t('courier.profile.email')}
            </Text>
            <Text style={[styles.value, { color: c.textPrimary }]}>{profile.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: c.textSecondary }]}>
              {t('courier.profile.mobile')}
            </Text>
            <Text style={[styles.value, { color: c.textPrimary }]}>{profile.mobile}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 24,
  },
  stateBlock: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 24,
  },
  stateText: {
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  row: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});
