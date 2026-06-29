/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeBlurView } from '@/components/ui/safe-blur-view';
import { useCourierProfile } from '@/features/courier/api';
import { useLogoutConfirmModal } from '@/features/settings/hooks/use-logout-confirm-modal';
import { useAppTheme } from '@/lib/hooks/use-app-theme';
import { useOrdersStore } from '../orders/store/use-orders-store';
import { useDrawer } from './drawer-context';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.78;
const SPRING_CONFIG = { damping: 22, stiffness: 200, mass: 0.8 };

type NavItem = { labelKey: 'courier.drawer.home' | 'courier.drawer.settings'; icon: string; route: string };

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'courier.drawer.home', icon: '📦', route: '/orders' },
  { labelKey: 'courier.drawer.settings', icon: '⚙️', route: '/settings' },
];

function getInitials(name: string, surname: string): string {
  const first = name.trim().charAt(0);
  const last = surname.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
}

export function AppDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark, c } = useAppTheme();
  const { t } = useTranslation();
  const { openLogoutConfirm } = useLogoutConfirmModal();
  const { data: courierProfile, isLoading: isProfileLoading } = useCourierProfile();

  const completedCount = useOrdersStore(s => s.completedCount());

  const displayName = courierProfile
    ? `${courierProfile.name} ${courierProfile.surname}`.trim()
    : t('courier.drawer.profile_loading');
  const initials = courierProfile
    ? getInitials(courierProfile.name, courierProfile.surname)
    : '?';

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 250 });
    }
    else {
      translateX.value = withSpring(-DRAWER_WIDTH, SPRING_CONFIG);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, translateX, opacity]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DRAWER_WIDTH, 0], [0, 1]),
    pointerEvents: opacity.value > 0 ? 'auto' : 'none',
  }));

  const handleNavPress = (route: string) => {
    closeDrawer();
    setTimeout(() => router.push(route as never), 180);
  };

  const handleLogout = () => {
    closeDrawer();
    setTimeout(() => openLogoutConfirm(), 200);
  };

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH }, drawerStyle]}>
        <SafeBlurView
          intensity={isDark ? 60 : 70}
          tint={c.blurTint}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[
          styles.drawerInner,
          { backgroundColor: isDark ? 'rgba(18,18,18,0.55)' : 'rgba(255,255,255,0.55)' },
        ]}
        >

          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
            <Text style={[styles.userName, { color: c.textPrimary }]}>
              {isProfileLoading && !courierProfile ? t('courier.drawer.profile_loading') : displayName}
            </Text>
            {courierProfile?.email
              ? (
                  <Text style={[styles.userEmail, { color: c.textSecondary }]}>
                    {courierProfile.email}
                  </Text>
                )
              : null}
            <Text style={[styles.userRole, { color: c.textSecondary }]}>
              {t('courier.drawer.role')}
            </Text>
          </View>

          <View style={[styles.statsRow, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }]}
          >
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={[styles.statLabel, { color: c.textSecondary }]}>
                {t('courier.drawer.delivered_session')}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]} />

          <View style={styles.nav}>
            {NAV_ITEMS.map(item => (
              <Pressable
                key={item.route}
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                ]}
                onPress={() => handleNavPress(item.route)}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={[styles.navLabel, { color: c.textPrimary }]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', marginBottom: 12 }]} />
            <Pressable
              style={({ pressed }) => [
                styles.navItem,
                pressed && { backgroundColor: 'rgba(232,49,59,0.08)' },
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.navIcon}>🚪</Text>
              <Text style={[styles.navLabel, { color: '#E8313B' }]}>
                {t('courier.drawer.logout')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 101,
    overflow: 'hidden',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  drawerInner: {
    flex: 1,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#FF6C00',
    backgroundColor: 'rgba(255,108,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6C00',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6C00',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 2,
    gap: 14,
  },
  navIcon: {
    fontSize: 20,
    width: 26,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  footer: {
    paddingHorizontal: 8,
  },
});
