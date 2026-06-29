import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  title: string;
};

export function SettingsScreenHeader({ title }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark, c } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: c.bg, borderBottomColor: c.border }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
        <Text style={styles.backText}>{t('common.back_arrow')}</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: c.textPrimary }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  backBtn: { alignSelf: 'flex-start' },
  backText: { fontSize: 15, fontWeight: '600', color: '#FF6C00' },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
});
