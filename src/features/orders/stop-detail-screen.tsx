/* eslint-disable max-lines-per-function */
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Pressable,
  ScrollView,
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

import { FocusAwareStatusBar } from '@/components/ui';
import { useCompleteAssignment } from '@/features/courier/api';
import { useCourierStops } from '@/features/courier/hooks/use-courier-stops';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { CompanyPickupCard } from './components/company-pickup-card';
import { useStopsWithLocalState } from './hooks/use-stops-with-local-state';
import { useOrdersStore } from './store/use-orders-store';

const HERO_HEIGHT = 260;
const HEADER_COLLAPSE_AT = HERO_HEIGHT - 80;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function StopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark, c } = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const { stops: mappedStops } = useCourierStops();
  const completeAssignment = useCompleteAssignment();
  const stops = useStopsWithLocalState(mappedStops);
  const setPickedUpQuantity = useOrdersStore(s => s.setPickedUpQuantity);
  const markDelivered = useOrdersStore(s => s.markDelivered);
  const stop = stops.find(s => s.id === id);

  const pickedCount = stop?.companies.filter(co => co.pickedUpQuantity > 0).length ?? 0;
  const totalCompanies = stop?.companies.length ?? 0;
  const isDirectComplete = totalCompanies === 0;
  const allPickedUp = totalCompanies > 0 && pickedCount === totalCompanies;
  const progressPercent = totalCompanies > 0 ? (pickedCount / totalCompanies) * 100 : 0;
  const canComplete = Boolean(stop && !stop.isDelivered && (isDirectComplete || allPickedUp));

  const handleMarkDelivered = React.useCallback(async () => {
    if (!stop) {
      return;
    }

    if (!isDirectComplete && !allPickedUp) {
      Alert.alert(
        t('courier.stop.pick_quantity_title'),
        t('courier.stop.pick_quantity_message'),
        [{ text: t('common.ok') }],
      );
      return;
    }

    try {
      await completeAssignment.mutateAsync({ id: Number(stop.id) });
      markDelivered(stop.id);
      router.back();
    }
    catch (error) {
      if (__DEV__) {
        console.error('Failed to complete assignment', error);
      }
    }
  }, [allPickedUp, completeAssignment, isDirectComplete, markDelivered, router, stop, t]);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, -HERO_HEIGHT * 0.4], 'clamp') },
      { scale: interpolate(scrollY.value, [-60, 0], [1.12, 1], 'clamp') },
    ],
  }));

  const collapsedHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HEADER_COLLAPSE_AT, HEADER_COLLAPSE_AT + 40], [0, 1], 'clamp'),
  }));

  if (!stop) {
    return (
      <View style={[styles.notFound, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.textPrimary, fontSize: 16 }}>
          {t('courier.stop.stop_not_found')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <FocusAwareStatusBar />

      <Pressable
        onPress={() => router.back()}
        style={[
          styles.backBtn,
          {
            top: insets.top + 10,
            backgroundColor: isDark ? 'rgba(23,23,23,0.92)' : '#ffffff',
          },
        ]}
        hitSlop={8}
      >
        <Text style={[styles.backBtnArrow, { color: isDark ? '#FAFAFA' : '#111111' }]}>←</Text>
      </Pressable>

      <Animated.View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top, backgroundColor: c.bg, borderBottomColor: c.border },
          collapsedHeaderStyle,
        ]}
        pointerEvents="none"
      >
        <Text style={[styles.stickyTitle, { color: c.textPrimary }]} numberOfLines={1}>
          {stop.name}
        </Text>
      </Animated.View>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
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

        <View style={[styles.content, { backgroundColor: c.bg }]}>
          <Animated.View
            entering={FadeInDown.delay(40).springify().damping(18)}
            style={[styles.progressCard, { backgroundColor: c.card, borderColor: c.border }]}
          >
            <View style={styles.progressRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.progressTitle, { color: c.textPrimary }]}>
                  {totalCompanies === 0
                    ? t('courier.stop.no_companies')
                    : allPickedUp
                      ? t('courier.stop.all_picked')
                      : t('courier.stop.companies_progress', { picked: pickedCount, total: totalCompanies })}
                </Text>
                <Text style={[styles.progressSub, { color: c.textSecondary }]}>
                  {totalCompanies === 0
                    ? ''
                    : allPickedUp
                      ? t('courier.stop.ready_to_deliver')
                      : t('courier.stop.pick_for_each')}
                </Text>
              </View>
              {totalCompanies > 0 && (
                <View style={[styles.circleProgress, { borderColor: allPickedUp ? '#22C55E' : '#FF6C00' }]}>
                  <Text style={[styles.circleText, { color: allPickedUp ? '#22C55E' : '#FF6C00' }]}>
                    {pickedCount}
                    /
                    {totalCompanies}
                  </Text>
                </View>
              )}
            </View>
            {totalCompanies > 0 && (
              <View style={[styles.progTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                <View
                  style={[styles.progFill, {
                    backgroundColor: allPickedUp ? '#22C55E' : '#FF6C00',
                    width: `${progressPercent}%`,
                  }]}
                />
              </View>
            )}
          </Animated.View>

          {totalCompanies > 0 && (
            <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
                {t('courier.stop.companies_section', { count: totalCompanies })}
              </Text>
              {stop.companies.map((company, idx) => (
                <CompanyPickupCard
                  key={company.id}
                  company={company}
                  onQuantityChange={qty => setPickedUpQuantity(stop.id, company.id, qty)}
                  index={idx}
                />
              ))}
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(180).springify().damping(18)}
            style={[
              styles.deliverCard,
              {
                backgroundColor: stop.isDelivered
                  ? (isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4')
                  : (isDark ? 'rgba(255,108,0,0.08)' : '#FFF8F3'),
                borderColor: stop.isDelivered
                  ? (isDark ? 'rgba(34,197,94,0.25)' : '#BBF7D0')
                  : (isDark ? 'rgba(255,108,0,0.2)' : '#FFD4B0'),
              },
            ]}
          >
            <View style={styles.deliverHeader}>
              <Text style={styles.deliverIcon}>
                {stop.isDelivered ? '🎉' : '🚚'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.deliverTitle, { color: c.textPrimary }]}>
                  {stop.isDelivered
                    ? t('courier.stop.deliver_done_title')
                    : t('courier.stop.deliver_title')}
                </Text>
                <Text style={[styles.deliverSub, { color: c.textSecondary }]}>
                  {stop.isDelivered
                    ? t('courier.stop.deliver_done_sub')
                    : stop.address}
                </Text>
              </View>
            </View>

            {!stop.isDelivered && (
              <Pressable
                onPress={handleMarkDelivered}
                disabled={!canComplete}
                style={({ pressed }) => [
                  styles.deliverBtn,
                  {
                    backgroundColor: canComplete
                      ? '#22C55E'
                      : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[
                  styles.deliverBtnText,
                  { color: canComplete ? '#fff' : c.textSecondary },
                ]}
                >
                  {isDirectComplete || canComplete
                    ? t('courier.stop.confirm_delivery')
                    : t('courier.stop.specify_quantity_cta')}
                </Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 50,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  backBtnArrow: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    includeFontPadding: false,
    textAlign: 'center',
  },
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
  content: {
    padding: 16,
    paddingTop: 16,
  },
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  deliverCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    gap: 14,
  },
  deliverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  deliverIcon: {
    fontSize: 32,
  },
  deliverTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  deliverSub: {
    fontSize: 12,
    marginTop: 3,
  },
  deliverBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deliverBtnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
