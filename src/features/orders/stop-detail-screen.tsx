import { BlurView } from 'expo-blur';
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

const HEADER_HEIGHT = 240;
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

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT / 2], 'clamp') },
      { scale: interpolate(scrollY.value, [-80, 0], [1.15, 1], 'clamp') },
    ],
  }));

  const headerBlurOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [60, 120], [0, 1], 'clamp'),
  }));

  if (!stop) {
    return (
      <View style={[styles.notFound, { backgroundColor: isDark ? '#0a0a0a' : '#F5F5F5' }]}>
        <Text style={{ color: isDark ? '#fafafa' : '#1E1E1E', fontSize: 16 }}>Stop not found.</Text>
      </View>
    );
  }

  const pickedCount = stop.orders.filter(o => o.isPickedUp).length;
  const total = stop.orders.length;
  const allDone = pickedCount === total;
  const bg = isDark ? '#0a0a0a' : '#F5F5F5';
  const textPrimary = isDark ? '#fafafa' : '#1E1E1E';
  const textSecondary = isDark ? '#A3A3A3' : '#7D7D7D';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Floating blur header (appears on scroll) */}
      <Animated.View
        style={[styles.floatingHeader, { paddingTop: insets.top }, headerBlurOpacity]}
        pointerEvents="none"
      >
        <BlurView
          intensity={isDark ? 70 : 80}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.floatingHeaderInner, { backgroundColor: isDark ? 'rgba(10,10,10,0.7)' : 'rgba(245,245,245,0.7)' }]}>
          <Text style={[styles.floatingTitle, { color: textPrimary }]} numberOfLines={1}>
            {stop.name}
          </Text>
        </View>
      </Animated.View>

      {/* Back button (always visible) */}
      <View style={[styles.backButtonWrapper, { top: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.backButtonInner}>
            <Text style={styles.backButtonText}>←</Text>
          </View>
        </Pressable>
      </View>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Animated.View style={[StyleSheet.absoluteFillObject, heroStyle]}>
            <Image
              source={{ uri: stop.photoUrl }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
          </Animated.View>
          {/* Gradient overlay */}
          <View style={styles.heroGradient} />
          {/* Info overlay on hero */}
          <View style={[styles.heroInfo, { paddingBottom: insets.bottom > 0 ? 20 : 28 }]}>
            <Text style={styles.heroName}>{stop.name}</Text>
            <Text style={styles.heroAddress}>{stop.address}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Progress card */}
          <Animated.View
            entering={FadeInDown.delay(50).springify().damping(18)}
            style={[
              styles.progressCard,
              {
                backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
                borderColor: allDone ? 'rgba(34,197,94,0.35)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
              },
            ]}
          >
            <View style={styles.progressInfo}>
              <View>
                <Text style={[styles.progressTitle, { color: textPrimary }]}>
                  {allDone ? '🎉 All orders picked up!' : `${pickedCount} of ${total} picked up`}
                </Text>
                <Text style={[styles.progressSubtitle, { color: textSecondary }]}>
                  {allDone
                    ? 'This stop is marked as complete'
                    : 'Check off each customer below'}
                </Text>
              </View>
              <View style={[
                styles.progressCircle,
                { borderColor: allDone ? '#22C55E' : '#FF6C00' },
              ]}>
                <Text style={[styles.progressCircleText, { color: allDone ? '#22C55E' : '#FF6C00' }]}>
                  {pickedCount}/{total}
                </Text>
              </View>
            </View>
            {/* Bar */}
            <View style={[styles.progBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }]}>
              <Animated.View
                style={[
                  styles.progFill,
                  {
                    backgroundColor: allDone ? '#22C55E' : '#FF6C00',
                    width: `${(pickedCount / total) * 100}%`,
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Orders list */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
            <Text style={[styles.ordersTitle, { color: textSecondary }]}>
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
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    overflow: 'hidden',
  },
  floatingHeaderInner: {
    paddingHorizontal: 64,
    paddingVertical: 12,
    alignItems: 'center',
  },
  floatingTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  backButtonWrapper: {
    position: 'absolute',
    left: 16,
    zIndex: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  heroContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroAddress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: 16,
    paddingTop: 14,
  },
  progressCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  progressSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progBar: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 3,
  },
  ordersTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
});
