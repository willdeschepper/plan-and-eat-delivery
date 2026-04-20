import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { useDrawer } from '../drawer/drawer-context';
import { BurgerButton } from './components/burger-button';
import { DeliveryStopCard } from './components/delivery-stop-card';
import { useOrdersStore } from './store/use-orders-store';

function formatDate(date: Date): { dayName: string; fullDate: string } {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return {
    dayName: days[date.getDay()],
    fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
  };
}

export function OrdersScreen() {
  const { isDark, c } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { openDrawer } = useDrawer();

  const stops = useOrdersStore(s => s.stops);
  const isStopLocked = useOrdersStore(s => s.isStopLocked);
  const isStopCompleted = useOrdersStore(s => s.isStopCompleted);

  const { dayName, fullDate } = formatDate(new Date());

  const pendingStops = stops.filter(s => !isStopCompleted(s.id));
  const completedStops = stops.filter(s => isStopCompleted(s.id));
  const allDone = pendingStops.length === 0 && stops.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: c.bg, borderBottomColor: c.border }]}>
        {/* Row 1: burger + pill */}
        <View style={styles.headerRow}>
          <BurgerButton onPress={openDrawer} isDark={isDark} />
          <View style={[styles.stopsPill, {
            backgroundColor: isDark ? 'rgba(255,108,0,0.12)' : '#FFF3EB',
            borderColor: isDark ? 'rgba(255,108,0,0.2)' : '#FFD4B0',
          }]}>
            <Text style={styles.stopsPillText}>{stops.length} stops today</Text>
          </View>
        </View>

        {/* Row 2: title + date */}
        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
            Today's Deliveries
          </Text>
          <Text style={[styles.headerDate, { color: c.textSecondary }]}>
            {dayName} · {fullDate}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* All done banner */}
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
              <Text style={[styles.allDoneTitle, { color: c.textPrimary }]}>All deliveries done!</Text>
              <Text style={[styles.allDoneSubtitle, { color: c.textSecondary }]}>Great work today!</Text>
            </View>
          </Animated.View>
        )}

        {/* Pending section */}
        {pendingStops.length > 0 && (
          <Animated.View layout={LinearTransition.springify()}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: '#FF6C00' }]} />
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>PENDING</Text>
              <View style={[styles.sectionCount, { backgroundColor: '#FF6C00' }]}>
                <Text style={styles.sectionCountText}>{pendingStops.length}</Text>
              </View>
            </View>
            {pendingStops.map((stop, idx) => (
              <DeliveryStopCard
                key={stop.id}
                stop={stop}
                isLocked={isStopLocked(stop.id)}
                isCompleted={false}
                index={idx}
                onPress={() => router.push(`/stop/${stop.id}` as never)}
              />
            ))}
          </Animated.View>
        )}

        {/* Completed section */}
        {completedStops.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(80).springify().damping(18)}
            layout={LinearTransition.springify()}
          >
            <View style={[styles.sectionHeader, { marginTop: pendingStops.length > 0 ? 8 : 0 }]}>
              <View style={[styles.sectionDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>COMPLETED</Text>
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

  /* ── Header ── */
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
  headerTitleBlock: {
    gap: 3,
  },
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

  /* ── Scroll content ── */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  /* ── All done banner ── */
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

  /* ── Section headers ── */
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
