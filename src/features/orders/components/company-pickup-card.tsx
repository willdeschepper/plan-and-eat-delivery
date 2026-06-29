import type { CompanyPickup } from '../types';
import { Image } from 'expo-image';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  company: CompanyPickup;
  onQuantityChange: (quantity: number) => void;
  index: number;
};

export function CompanyPickupCard({ company, onQuantityChange, index }: Props) {
  const { isDark, c } = useAppTheme();
  const { t } = useTranslation();

  const totalRequired = company.items.reduce((sum, item) => sum + item.quantity, 0);
  const isReady = company.pickedUpQuantity > 0;

  const cardBg = isDark ? 'rgba(28,28,28,0.95)' : 'rgba(255,255,255,0.95)';
  const itemBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const borderColor = isReady ? 'rgba(34,197,94,0.35)' : c.border;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      {/* Header row: photo + name + address */}
      <View style={styles.header}>
        <Image
          source={{ uri: company.photoUrl }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <View style={[styles.indexBadge, { backgroundColor: isDark ? 'rgba(255,108,0,0.15)' : 'rgba(255,108,0,0.1)' }]}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <Text style={[styles.companyName, { color: c.textPrimary }]} numberOfLines={1}>
              {company.name}
            </Text>
          </View>
          <Text style={[styles.companyAddress, { color: c.textSecondary }]} numberOfLines={1}>
            {company.address}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

      {/* Items to deliver */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
          {t('courier.company.deliver_section')}
        </Text>
        <View style={styles.itemsList}>
          {company.items.map(item => (
            <View key={item.id} style={[styles.itemRow, { backgroundColor: itemBg }]}>
              <Text style={styles.itemDot}>•</Text>
              <Text style={[styles.itemName, { color: c.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.qtyBadge, { backgroundColor: isDark ? 'rgba(255,108,0,0.15)' : 'rgba(255,108,0,0.1)' }]}>
                <Text style={styles.qtyText}>×{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

      {/* Quantity stepper */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
          {t('courier.company.picked_section')}
        </Text>
        <View style={styles.stepperRow}>
          <Text style={[styles.stepperHint, { color: c.textSecondary }]}>
            {t('courier.company.required_qty', { count: totalRequired })}
          </Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => onQuantityChange(company.pickedUpQuantity - 1)}
              style={({ pressed }) => [
                styles.stepBtn,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
                pressed && { opacity: 0.6 },
              ]}
              hitSlop={8}
            >
              <Text style={[styles.stepBtnText, { color: c.textPrimary }]}>−</Text>
            </Pressable>

            <View style={[
              styles.stepValue,
              { backgroundColor: isReady ? 'rgba(34,197,94,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') },
            ]}>
              <Text style={[
                styles.stepValueText,
                { color: isReady ? '#22C55E' : c.textPrimary },
              ]}>
                {company.pickedUpQuantity}
              </Text>
            </View>

            <Pressable
              onPress={() => onQuantityChange(company.pickedUpQuantity + 1)}
              style={({ pressed }) => [
                styles.stepBtn,
                { backgroundColor: '#FF6C00' },
                pressed && { opacity: 0.75 },
              ]}
              hitSlop={8}
            >
              <Text style={[styles.stepBtnText, { color: '#fff' }]}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  photo: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indexBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    color: '#FF6C00',
    fontSize: 11,
    fontWeight: '700',
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    flex: 1,
  },
  companyAddress: {
    fontSize: 12,
    fontWeight: '400',
    paddingLeft: 28,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  section: {
    padding: 14,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  itemsList: {
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  itemDot: {
    color: '#FF6C00',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  itemName: {
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
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperHint: {
    fontSize: 13,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    includeFontPadding: false,
    textAlign: 'center',
  },
  stepValue: {
    minWidth: 48,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stepValueText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
