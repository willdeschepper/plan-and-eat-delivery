import type { Language } from '@/lib/i18n/resources';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  label: string;
  value: Language;
  selected: boolean;
  onPress: (value: Language) => void;
  isLast?: boolean;
  testID?: string;
};

export function LanguageOptionRow({
  label,
  value,
  selected,
  onPress,
  isLast = false,
  testID,
}: Props) {
  const { c } = useAppTheme();

  const handlePress = React.useCallback(() => {
    onPress(value);
  }, [onPress, value]);

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.label, { color: c.textPrimary }]}>{label}</Text>
      {selected ? (
        <View style={styles.iconWrapper}>
          <Check stroke={c.textPrimary} />
        </View>
      ) : (
        <View style={styles.iconWrapper} />
      )}
    </Pressable>
  );
}

function Check({ stroke }: { stroke: string }) {
  return (
    <Svg width={25} height={24} fill="none" viewBox="0 0 25 24">
      <Path
        d="M20.5 6.5 9.5 17.5 4.5 12.5"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
