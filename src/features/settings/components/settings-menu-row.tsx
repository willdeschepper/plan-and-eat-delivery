import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowRight } from '@/components/icons';
import type { TxKeyPath } from '@/lib/i18n';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  labelTx: TxKeyPath;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  testID?: string;
};

export function SettingsMenuRow({
  labelTx,
  value,
  onPress,
  isLast = false,
  testID,
}: Props) {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const isPressable = onPress !== undefined;

  const content = (
    <>
      <Text style={[styles.label, { color: c.textPrimary }]}>{t(labelTx)}</Text>
      <View style={styles.right}>
        {value ? (
          <Text style={[styles.value, { color: c.textSecondary }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {isPressable ? (
          <View style={styles.iconWrapper}>
            <ArrowRight color={c.textSecondary} />
          </View>
        ) : null}
      </View>
    </>
  );

  if (!isPressable) {
    return (
      <View
        testID={testID}
        style={[
          styles.row,
          !isLast && { borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth },
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth },
        pressed && { opacity: 0.7 },
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    maxWidth: '55%',
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    flexShrink: 1,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
