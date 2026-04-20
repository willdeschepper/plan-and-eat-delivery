import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

import type { CustomerOrder } from '../types';

type Props = {
  order: CustomerOrder;
  onToggle: () => void;
  index: number;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  '#FF6C00', '#7C3AED', '#0EA5E9', '#16A34A',
  '#DC2626', '#D97706', '#0891B2', '#9333EA',
];

export function CustomerOrderItem({ order, onToggle, index }: Props) {
  const { isDark, c } = useAppTheme();

  const checkScale = useSharedValue(1);

  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = getInitials(order.customerName);

  const cardBg = isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)';
  const borderColor = order.isPickedUp
    ? 'rgba(34,197,94,0.35)'
    : c.border;
  const itemBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const handleToggle = () => {
    checkScale.value = withSpring(0.7, { damping: 8 }, () => {
      checkScale.value = withSpring(1, { damping: 12 });
    });
    onToggle();
  };

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      {/* Top row: avatar, name, checkbox */}
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={[styles.customerName, { color: c.textPrimary }]}>
            {order.customerName}
          </Text>
          <Text style={[styles.itemCount, { color: c.textSecondary }]}>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <Pressable onPress={handleToggle} hitSlop={12}>
          <Animated.View style={[
            styles.checkbox,
            order.isPickedUp ? styles.checkboxDone : {
              borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
              backgroundColor: 'transparent',
            },
            checkStyle,
          ]}>
            {order.isPickedUp && <Text style={styles.checkmark}>✓</Text>}
          </Animated.View>
        </Pressable>
      </View>

      {/* Food items */}
      <View style={[styles.itemsList, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
        {order.items.map(item => (
          <View key={item.id} style={[styles.foodItem, { backgroundColor: itemBg }]}>
            <Text style={styles.foodDot}>•</Text>
            <Text style={[styles.foodName, { color: c.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[styles.qtyBadge, { backgroundColor: isDark ? 'rgba(255,108,0,0.15)' : 'rgba(255,108,0,0.1)' }]}>
              <Text style={styles.qtyText}>×{item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nameBlock: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 13,
    fontWeight: '800',
  },
  itemsList: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    gap: 4,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  foodDot: {
    color: '#FF6C00',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  foodName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  qtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  qtyText: {
    color: '#FF6C00',
    fontSize: 12,
    fontWeight: '700',
  },
});
