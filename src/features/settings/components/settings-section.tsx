import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { TxKeyPath } from '@/lib/i18n';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  titleTx: TxKeyPath;
  children: React.ReactNode;
};

export function SettingsSection({ titleTx, children }: Props) {
  const { t } = useTranslation();
  const { c } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: c.textSecondary }]}>{t(titleTx)}</Text>
      <View style={[styles.container, { backgroundColor: c.card, borderColor: c.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
