import { BlurView } from 'expo-blur';
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
import { useUniwind } from 'uniwind';

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
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
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

  const bg = isDark ? '#0a0a0a' : '#F5F5F5';
  const headerBg = isDark ? 'rgba(10,10,10,0.85)' : 'rgba(245,245,245,0.85)';
  const textPrimary = isDark ? '#fafafa' : '#1E1E1E';
  const textSecondary = isDark ? '#A3A3A3' : '#7D7D7D';
  const sectionHeaderBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Sticky Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <BlurView
          intensity={isDark ? 60 : 70}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.headerInner, { backgroundColor: headerBg }]}>
          <BurgerButton onPress={openDrawer} isDark={isDark} />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              Today's Deliveries
            </Text>
            <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
              {dayName} · {fullDate}
            </Text>
          </View>
          {/* Stop counter */}
          <View style={[styles.counterPill, { backgroundColor: isDark ? 'rgba(255,108,0,0.15)' : 'rgba(255,108,0,0.1)' }]}>
            <Text style={styles.counterText}>{stops.length}</Text>
            <Text style={[styles.counterLabel, { color: textSecondary }]}>stops</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* All done banner */}
        {allDone && (
          <Animated.View
            entering={FadeInDown.springify().damping(18)}
            style={styles.allDoneBanner}
          >
            <BlurView intensity={isDark ? 40 : 50} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.allDoneBannerInner, { backgroundColor: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' }]}>
              <Text style={styles.allDoneEmoji}>🎉</Text>
              <View>
                <Text style={[styles.allDoneTitle, { color: textPrimary }]}>All deliveries done!</Text>
                <Text style={[styles.allDoneSubtitle, { color: textSecondary }]}>Great work today, Ibrohim!</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Pending section */}
        {pendingStops.length > 0 && (
          <Animated.View layout={LinearTransition.springify()}>
            <View style={[styles.sectionHeader, { backgroundColor: sectionHeaderBg }]}>
              <View style={styles.sectionDot} />
              <Text style={[styles.sectionTitle, { color: textSecondary }]}>
                PENDING
              </Text>
              <View style={[styles.sectionBadge, { backgroundColor: '#FF6C00' }]}>
                <Text style={styles.sectionBadgeText}>{pendingStops.length}</Text>
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
            entering={FadeInDown.delay(100).springify().damping(18)}
            layout={LinearTransition.springify()}
          >
            <View style={[styles.sectionHeader, { backgroundColor: sectionHeaderBg }]}>
              <View style={[styles.sectionDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.sectionTitle, { color: textSecondary }]}>
                COMPLETED
              </Text>
              <View style={[styles.sectionBadge, { backgroundColor: '#22C55E' }]}>
                <Text style={styles.sectionBadgeText}>{completedStops.length}</Text>
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
  container: {
    flex: 1,
  },
  header: {
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  counterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
  },
  counterText: {
    color: '#FF6C00',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  counterLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  allDoneBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
  },
  allDoneBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  allDoneEmoji: {
    fontSize: 36,
  },
  allDoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  allDoneSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6C00',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  sectionBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  sectionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
