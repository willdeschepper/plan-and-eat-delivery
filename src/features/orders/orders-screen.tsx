/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusAwareStatusBar } from '@/components/ui';
import { USE_COURIER_API_ORDERS } from '@/features/courier/config';
import { useCourierStops } from '@/features/courier/hooks/use-courier-stops';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { useDrawer } from '../drawer/drawer-context';
import { BurgerButton } from './components/burger-button';
import { DeliveryStopCard } from './components/delivery-stop-card';
import { useStopsWithLocalState } from './hooks/use-stops-with-local-state';

function formatDate(date: Date, locale: string): { dayName: string; fullDate: string } {
  return {
    dayName: date.toLocaleDateString(locale, { weekday: 'long' }),
    fullDate: date.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export function OrdersScreen() {
  const { isDark, c } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { t, i18n } = useTranslation();

  const { stops: mappedStops, isLoading, isError, refetch, isRefetching } = useCourierStops();
  const stops = useStopsWithLocalState(mappedStops);

  const { dayName, fullDate } = formatDate(new Date(), i18n.language);

  const pendingStops = stops.filter(s => !s.isDelivered);
  const completedStops = stops.filter(s => s.isDelivered);
  const allDone = pendingStops.length === 0 && stops.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <FocusAwareStatusBar />

      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: c.bg, borderBottomColor: c.border }]}>
        <View style={styles.headerRow}>
          <BurgerButton onPress={openDrawer} isDark={isDark} />
          <View style={[styles.stopsPill, {
            backgroundColor: isDark ? 'rgba(255,108,0,0.12)' : '#FFF3EB',
            borderColor: isDark ? 'rgba(255,108,0,0.2)' : '#FFD4B0',
          }]}
          >
            <Text style={styles.stopsPillText}>
              {t('courier.orders.stops_today', { count: stops.length })}
            </Text>
          </View>
        </View>

        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
            {t('courier.orders.title')}
          </Text>
          <Text style={[styles.headerDate, { color: c.textSecondary }]}>
            {dayName}
            {' · '}
            {fullDate}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor="#FF6C00"
          />
        )}
      >
        {USE_COURIER_API_ORDERS && isLoading && (
          <View style={styles.stateBlock}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {t('courier.orders.loading')}
            </Text>
          </View>
        )}

        {USE_COURIER_API_ORDERS && isError && !isLoading && stops.length === 0 && (
          <View style={styles.stateBlock}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {t('courier.orders.load_failed')}
            </Text>
            <Pressable onPress={() => void refetch()} style={styles.retryBtn}>
              <Text style={styles.retryText}>{t('courier.orders.retry')}</Text>
            </Pressable>
          </View>
        )}

        {!isLoading && !isError && stops.length === 0 && (
          <View style={styles.stateBlock}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {t('courier.orders.empty')}
            </Text>
          </View>
        )}

        {allDone && (
          <Animated.View
            entering={FadeInDown.springify().damping(18)}
            style={[styles.allDoneBanner, {
              backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4',
              borderColor: isDark ? 'rgba(34,197,94,0.25)' : '#BBF7D0',
            }]}
          >
            <Text style={styles.allDoneEmoji}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.allDoneTitle, { color: c.textPrimary }]}>
                {t('courier.orders.all_done_title')}
              </Text>
              <Text style={[styles.allDoneSubtitle, { color: c.textSecondary }]}>
                {t('courier.orders.all_done_subtitle')}
              </Text>
            </View>
          </Animated.View>
        )}

        {pendingStops.length > 0 && (
          <Animated.View layout={LinearTransition.springify()}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: '#FF6C00' }]} />
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
                {t('courier.orders.pending')}
              </Text>
              <View style={[styles.sectionCount, { backgroundColor: '#FF6C00' }]}>
                <Text style={styles.sectionCountText}>{pendingStops.length}</Text>
              </View>
            </View>
            {pendingStops.map((stop, idx) => (
              <DeliveryStopCard
                key={stop.id}
                stop={stop}
                isLocked={false}
                isCompleted={false}
                index={idx}
                onPress={() => router.push(`/stop/${stop.id}` as never)}
              />
            ))}
          </Animated.View>
        )}

        {completedStops.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(80).springify().damping(18)}
            layout={LinearTransition.springify()}
          >
            <View style={[styles.sectionHeader, { marginTop: pendingStops.length > 0 ? 8 : 0 }]}>
              <View style={[styles.sectionDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
                {t('courier.orders.completed')}
              </Text>
              <View style={[styles.sectionCount, { backgroundColor: '#22C55E' }]}>
                <Text style={styles.sectionCountText}>{completedStops.length}</Text>
              </View>
            </View>
            {completedStops.map((stop, idx) => (
              <DeliveryStopCard
                key={stop.id}
                stop={stop}
                isLocked={false}
                isCompleted={true}
                index={idx}
                onPress={() => router.push(`/stop/${stop.id}` as never)}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 12,
  },
  stopsPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  stopsPillText: {
    color: '#FF6C00',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  headerTitleBlock: { gap: 3 },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  headerDate: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  stateBlock: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,108,0,0.12)',
  },
  retryText: {
    color: '#FF6C00',
    fontSize: 14,
    fontWeight: '600',
  },
  allDoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  allDoneEmoji: { fontSize: 32 },
  allDoneTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  allDoneSubtitle: { fontSize: 13, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  sectionCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  sectionCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
