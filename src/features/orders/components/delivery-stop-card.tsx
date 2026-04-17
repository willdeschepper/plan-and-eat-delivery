import { SafeBlurView } from '@/components/ui/safe-blur-view';
import { Image } from 'expo-image';
import * as React from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useUniwind } from 'uniwind';

import type { DeliveryStop } from '../types';

type Props = {
  stop: DeliveryStop;
  isLocked: boolean;
  isCompleted: boolean;
  index: number;
  onPress: () => void;
};

function openWaze(address: string) {
  const query = encodeURIComponent(address);
  Linking.openURL(`waze://?q=${query}&navigate=yes`).catch(() =>
    Linking.openURL(`https://waze.com/ul?q=${query}`),
  );
}

function openGoogleMaps(address: string) {
  const query = encodeURIComponent(address);
  Linking.openURL(`https://maps.google.com/?q=${query}`);
}

export function DeliveryStopCard({ stop, isLocked, isCompleted, index, onPress }: Props) {
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const scale = useSharedValue(1);
  const pickedCount = stop.orders.filter(o => o.isPickedUp).length;
  const total = stop.orders.length;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) scale.value = withSpring(0.975);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 80).springify().damping(18)}
      style={[styles.wrapper, cardStyle]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={isLocked ? undefined : onPress}
        style={styles.pressable}
      >
        {/* Glass card */}
        <View style={[
          styles.card,
          {
            borderColor: isCompleted
              ? 'rgba(34,197,94,0.3)'
              : isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.07)',
          },
        ]}>
          <SafeBlurView
            intensity={isDark ? 40 : 50}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[
            styles.cardInner,
            { backgroundColor: isDark ? 'rgba(23,23,23,0.6)' : 'rgba(255,255,255,0.65)' },
          ]}>
            {/* Photo */}
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: stop.photoUrl }}
                style={styles.photo}
                contentFit="cover"
                transition={300}
              />
              {/* Completed badge */}
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ Completed</Text>
                </View>
              )}
              {/* Lock overlay */}
              {isLocked && (
                <View style={styles.lockOverlay}>
                  <View style={styles.lockIconWrapper}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.lockText}>Complete previous stop first</Text>
                  </View>
                </View>
              )}
              {/* Order count pill */}
              <View style={[
                styles.orderCountPill,
                { backgroundColor: isCompleted ? '#22C55E' : '#FF6C00' },
              ]}>
                <Text style={styles.orderCountText}>📦 {total}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.name, { color: isDark ? '#fafafa' : '#1E1E1E' }]} numberOfLines={1}>
                  {stop.name}
                </Text>
              </View>
              <Text style={[styles.address, { color: isDark ? '#A3A3A3' : '#7D7D7D' }]} numberOfLines={1}>
                {stop.address}
              </Text>

              {/* Progress bar */}
              {!isLocked && (
                <View style={styles.progressRow}>
                  <View style={[styles.progressBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }]}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: isCompleted ? '#22C55E' : '#FF6C00',
                          width: `${(pickedCount / total) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { color: isDark ? '#A3A3A3' : '#7D7D7D' }]}>
                    {pickedCount}/{total} picked up
                  </Text>
                </View>
              )}

              {/* Actions row */}
              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => openWaze(stop.address)}
                  style={({ pressed }) => [
                    styles.navBtn,
                    styles.navBtnWaze,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={styles.navBtnText}>🗺 Waze</Text>
                </Pressable>

                <Pressable
                  onPress={() => openGoogleMaps(stop.address)}
                  style={({ pressed }) => [
                    styles.navBtn,
                    styles.navBtnMaps,
                    { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={[styles.navBtnText, { color: isDark ? '#fafafa' : '#1E1E1E' }]}>
                    📍 Maps
                  </Text>
                </Pressable>

                {/* Auto-checkbox */}
                <View style={[
                  styles.checkbox,
                  isCompleted
                    ? styles.checkboxDone
                    : { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', backgroundColor: 'transparent' },
                ]}>
                  {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  pressable: {
    borderRadius: 22,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardInner: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  photoContainer: {
    position: 'relative',
    height: 160,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  lockIcon: {
    fontSize: 32,
  },
  lockText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  orderCountPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  orderCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  info: {
    padding: 16,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    flex: 1,
  },
  address: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    minWidth: 72,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navBtnWaze: {
    backgroundColor: '#00B4E6',
  },
  navBtnMaps: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  checkbox: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
