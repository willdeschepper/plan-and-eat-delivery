import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { TxKeyPath } from '@/lib/i18n';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { SettingsScreenHeader } from './settings-screen-header';

type Props = {
  titleTx: TxKeyPath;
  subtitleTx?: TxKeyPath;
  children?: React.ReactNode;
};

export function SettingsSubScreenLayout({
  titleTx,
  subtitleTx,
  children,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { c } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <SettingsScreenHeader title={t(titleTx)} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {subtitleTx ? (
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t(subtitleTx)}</Text>
        ) : null}
        {children ? <View style={styles.body}>{children}</View> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    marginTop: 16,
  },
});
