import type { SupportContactKind } from '../lib/support-contacts';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  kind: SupportContactKind;
  label: string;
  value: string;
  onPress: () => void;
  testID?: string;
};

const KIND_ICONS: Record<SupportContactKind, string> = {
  phone: '📞',
  email: '✉️',
  instagram: '📷',
};

export function SupportContactCard({
  kind,
  label,
  value,
  onPress,
  testID,
}: Props) {
  const { isDark, c } = useAppTheme();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
          borderColor: c.border,
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: isDark ? 'rgba(255,108,0,0.15)' : '#FFF3EB' }]}>
        <Text style={styles.icon}>{KIND_ICONS[kind]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: c.textPrimary }]}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  content: { flex: 1, gap: 4 },
  label: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  value: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
});
