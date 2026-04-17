import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { signOut } from '@/lib/hooks';
import { useOrdersStore } from '../orders/store/use-orders-store';
import { useDrawer } from './drawer-context';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.78;
const SPRING_CONFIG = { damping: 22, stiffness: 200, mass: 0.8 };

type NavItem = { label: string; icon: string; route: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Today's Orders", icon: '📦', route: '/orders' },
  { label: 'Settings', icon: '⚙️', route: '/settings' },
];

export function AppDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  const profile = useOrdersStore(s => s.profile);
  const completedCount = useOrdersStore(s => s.completedCount());

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 250 });
    } else {
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
    setTimeout(() => signOut(), 200);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeDrawer} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH }, drawerStyle]}>
        <BlurView
          intensity={isDark ? 60 : 70}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.drawerInner, { backgroundColor: isDark ? 'rgba(18,18,18,0.55)' : 'rgba(255,255,255,0.55)' }]}>

          {/* User info header */}
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.onlineDot} />
            </View>
            <Text style={[styles.userName, { color: isDark ? '#fafafa' : '#1E1E1E' }]}>
              {profile.name}
            </Text>
            <Text style={[styles.userRole, { color: isDark ? '#A3A3A3' : '#7D7D7D' }]}>
              Courier
            </Text>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#A3A3A3' : '#7D7D7D' }]}>Delivered</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${profile.totalEarnings.toFixed(0)}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#A3A3A3' : '#7D7D7D' }]}>Earned</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]} />

          {/* Navigation */}
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
                <Text style={[styles.navLabel, { color: isDark ? '#fafafa' : '#1E1E1E' }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Bottom: logout */}
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
              <Text style={[styles.navLabel, { color: '#E8313B' }]}>Logout</Text>
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
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#FF6C00',
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
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
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
