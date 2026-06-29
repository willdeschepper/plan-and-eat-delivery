import type { DeliveryStop } from '../types';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
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
import { SafeBlurView } from '@/components/ui/safe-blur-view';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  stop: DeliveryStop;
  isLocked: boolean;
  isCompleted: boolean;
  index: number;
  onPress: () => void;
};

type ThemeColors = ReturnType<typeof useAppTheme>['c'];

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

function StopCardHeader({
  totalCompanies,
  isCompleted,
  accentColor,
  isDark,
  deliveredLabel,
}: {
  totalCompanies: number;
  isCompleted: boolean;
  accentColor: string;
  isDark: boolean;
  deliveredLabel: string;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={[styles.countPill, { backgroundColor: accentColor }]}>
        <Text style={styles.countPillText}>
          🏪
          {' '}
          {totalCompanies}
        </Text>
      </View>
      {isCompleted && (
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>
            ✓
            {deliveredLabel}
          </Text>
        </View>
      )}
      <View style={[
        styles.checkbox,
        isCompleted
          ? styles.checkboxDone
          : {
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
              backgroundColor: 'transparent',
            },
      ]}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </View>
  );
}

function StopCardProgress({
  isCompleted,
  progressPercent,
  accentColor,
  textSecondary,
  isDark,
  progressDoneLabel,
  companiesProgressLabel,
}: {
  isCompleted: boolean;
  progressPercent: number;
  accentColor: string;
  textSecondary: string;
  isDark: boolean;
  progressDoneLabel: string;
  companiesProgressLabel: string;
}) {
  return (
    <View style={styles.progressRow}>
      <View style={[
        styles.progressBg,
        { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' },
      ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: accentColor, width: `${progressPercent}%` },
          ]}
        />
      </View>
      <Text style={[styles.progressLabel, { color: textSecondary }]}>
        {isCompleted ? progressDoneLabel : companiesProgressLabel}
      </Text>
    </View>
  );
}

function StopCardNavActions({
  address,
  c,
  isDark,
  wazeLabel,
  mapsLabel,
}: {
  address: string;
  c: ThemeColors;
  isDark: boolean;
  wazeLabel: string;
  mapsLabel: string;
}) {
  return (
    <View style={styles.actionsRow}>
      <Pressable
        onPress={() => openWaze(address)}
        style={({ pressed }) => [styles.navBtn, styles.navBtnWaze, pressed && { opacity: 0.75 }]}
      >
        <Text style={styles.navBtnText}>
          🗺
          {wazeLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => openGoogleMaps(address)}
        style={({ pressed }) => [
          styles.navBtn,
          styles.navBtnMaps,
          { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' },
          pressed && { opacity: 0.75 },
        ]}
      >
        <Text style={[styles.navBtnText, { color: c.textPrimary }]}>
          📍
          {mapsLabel}
        </Text>
      </Pressable>
    </View>
  );
}

export function DeliveryStopCard({ stop, isLocked, isCompleted, index, onPress }: Props) {
  const { isDark, c } = useAppTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const pickedCount = stop.companies.filter(co => co.pickedUpQuantity > 0).length;
  const totalCompanies = stop.companies.length;
  const progressPercent = totalCompanies > 0 ? (pickedCount / totalCompanies) * 100 : 0;
  const accentColor = isCompleted ? '#22C55E' : '#FF6C00';

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked)
      scale.value = withSpring(0.975);
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
        <View style={[styles.card, { borderColor: isCompleted ? 'rgba(34,197,94,0.3)' : c.border }]}>
          <SafeBlurView
            intensity={isDark ? 40 : 50}
            tint={c.blurTint}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[
            styles.cardInner,
            {
              backgroundColor: isDark ? 'rgba(23,23,23,0.6)' : 'rgba(255,255,255,0.65)',
              opacity: isLocked ? 0.55 : 1,
            },
          ]}
          >
            <View style={styles.content}>
              <StopCardHeader
                totalCompanies={totalCompanies}
                isCompleted={isCompleted}
                accentColor={accentColor}
                isDark={isDark}
                deliveredLabel={t('courier.stop.delivered_chip')}
              />

              {isLocked && (
                <View style={[
                  styles.lockBanner,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
                ]}
                >
                  <Text style={[styles.lockText, { color: c.textSecondary }]}>
                    🔒
                    {t('courier.card.locked')}
                  </Text>
                </View>
              )}

              <Text style={[styles.name, { color: c.textPrimary }]} numberOfLines={1}>
                {stop.name}
              </Text>
              <Text style={[styles.address, { color: c.textSecondary }]} numberOfLines={2}>
                {stop.address}
              </Text>

              {!isLocked && (
                <StopCardProgress
                  isCompleted={isCompleted}
                  progressPercent={progressPercent}
                  accentColor={accentColor}
                  textSecondary={c.textSecondary}
                  isDark={isDark}
                  progressDoneLabel={t('courier.card.progress_done')}
                  companiesProgressLabel={t('courier.card.companies_progress', {
                    picked: pickedCount,
                    total: totalCompanies,
                  })}
                />
              )}

              <StopCardNavActions
                address={stop.address}
                c={c}
                isDark={isDark}
                wazeLabel={t('courier.stop.nav_waze')}
                mapsLabel={t('courier.stop.nav_maps')}
              />
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
  content: {
    padding: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statusChip: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  lockBanner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  lockText: {
    fontSize: 13,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  address: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
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
    minWidth: 88,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
