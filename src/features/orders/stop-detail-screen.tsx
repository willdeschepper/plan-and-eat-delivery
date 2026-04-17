import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { CustomerOrderItem } from './components/customer-order-item';
import { useOrdersStore } from './store/use-orders-store';

const HERO_HEIGHT = 260;
const HEADER_COLLAPSE_AT = HERO_HEIGHT - 80;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function StopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const stops = useOrdersStore(s => s.stops);
  const toggleOrderPickedUp = useOrdersStore(s => s.toggleOrderPickedUp);
  const stop = stops.find(s => s.id === id);

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  /* Hero parallax */
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, -HERO_HEIGHT * 0.4], 'clamp') },
      { scale: interpolate(scrollY.value, [-60, 0], [1.12, 1], 'clamp') },
    ],
  }));

  /* Collapsed header fades in when scrolled past hero */
  const collapsedHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HEADER_COLLAPSE_AT, HEADER_COLLAPSE_AT + 40], [0, 1], 'clamp'),
  }));

  if (!stop) {
    return (
      <View style={[styles.notFound, { backgroundColor: isDark ? '#0a0a0a' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fafafa' : '#111', fontSize: 16 }}>Stop not found.</Text>
      </View>
    );
  }

  const pickedCount = stop.orders.filter(o => o.isPickedUp).length;
  const total = stop.orders.length;
  const allDone = pickedCount === total;

  const bg = isDark ? '#0a0a0a' : '#ffffff';
  const textPrimary = isDark ? '#fafafa' : '#111111';
  const textSecondary = isDark ? '#888' : '#999';
  const cardBg = isDark ? '#1a1a1a' : '#F7F7F7';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* ── Fixed back button — always on top of hero ── */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backBtn, { top: insets.top + 10 }]}
        hitSlop={8}
      >
        <Text style={styles.backBtnArrow}>←</Text>
      </Pressable>

      {/* ── Collapsed sticky header (appears after hero scrolled away) ── */}
      <Animated.View
        style={[styles.stickyHeader, { paddingTop: insets.top, backgroundColor: isDark ? '#0a0a0a' : '#fff', borderBottomColor: borderColor }, collapsedHeaderStyle]}
        pointerEvents="none"
      >
        <Text style={[styles.stickyTitle, { color: textPrimary }]} numberOfLines={1}>
          {stop.name}
        </Text>
      </Animated.View>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Animated.View style={[StyleSheet.absoluteFillObject, heroStyle]}>
            <Image
              source={{ uri: stop.photoUrl }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={200}
            />
          </Animated.View>
          <View style={styles.heroOverlay} />
          <View style={[styles.heroInfo, { paddingBottom: 24 }]}>
            <Text style={styles.heroName}>{stop.name}</Text>
            <Text style={styles.heroAddress}>{stop.address}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: bg }]}>

          {/* Progress card */}
          <Animated.View
            entering={FadeInDown.delay(40).springify().damping(18)}
            style={[styles.progressCard, { backgroundColor: cardBg, borderColor }]}
          >
            <View style={styles.progressRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.progressTitle, { color: textPrimary }]}>
                  {allDone ? '🎉 All orders picked up!' : `${pickedCount} of ${total} picked up`}
                </Text>
                <Text style={[styles.progressSub, { color: textSecondary }]}>
                  {allDone ? 'This stop is complete' : 'Check off each customer below'}
                </Text>
              </View>
              <View style={[styles.circleProgress, { borderColor: allDone ? '#22C55E' : '#FF6C00' }]}>
                <Text style={[styles.circleText, { color: allDone ? '#22C55E' : '#FF6C00' }]}>
                  {pickedCount}/{total}
                </Text>
              </View>
            </View>
            <View style={[styles.progTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
              <View
                style={[styles.progFill, {
                  backgroundColor: allDone ? '#22C55E' : '#FF6C00',
                  width: `${(pickedCount / total) * 100}%`,
                }]}
              />
            </View>
          </Animated.View>

          {/* Orders list */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
            <Text style={[styles.sectionLabel, { color: textSecondary }]}>
              CUSTOMER ORDERS
            </Text>
            {stop.orders.map((order, idx) => (
              <CustomerOrderItem
                key={order.id}
                order={order}
                onToggle={() => toggleOrderPickedUp(stop.id, order.id)}
                index={idx}
              />
            ))}
          </Animated.View>
        </View>
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* ── Back button ── */
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 50,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  backBtnArrow: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    includeFontPadding: false,
    textAlign: 'center',
  },

  /* ── Sticky collapsed header ── */
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    paddingBottom: 12,
  },
  stickyTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    paddingTop: 12,
  },

  /* ── Hero ── */
  heroContainer: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  heroName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  heroAddress: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* ── Content ── */
  content: {
    padding: 16,
    paddingTop: 16,
  },

  /* ── Progress card ── */
  progressCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 22,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  progressSub: {
    fontSize: 12,
    marginTop: 3,
  },
  circleProgress: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  progTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 3,
  },

  /* ── Section label ── */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
});
