import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Radio } from '@/components/ui/checkbox';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  label: string;
  value: ColorSchemeType;
  selected: boolean;
  icon: 'sun' | 'moon' | 'system';
  onPress: (value: ColorSchemeType) => void;
  testID?: string;
};

export function ThemeOptionRow({
  label,
  value,
  selected,
  icon,
  onPress,
  testID,
}: Props) {
  const { isDark, c } = useAppTheme();
  const iconColor = c.textPrimary;

  const handlePress = React.useCallback(() => {
    onPress(value);
  }, [onPress, value]);

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
          borderColor: c.border,
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={styles.left}>
        <Radio.Icon checked={selected} />
        <Text style={[styles.label, { color: c.textPrimary }]}>{label}</Text>
      </View>
      {icon === 'sun' ? <SunIcon color={iconColor} /> : null}
      {icon === 'moon' ? <MoonIcon color={iconColor} /> : null}
      {icon === 'system' ? <SystemIcon color={iconColor} /> : null}
    </Pressable>
  );
}

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 2.5v2.2M12 19.3v2.2M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.2 14.8A8.5 8.5 0 0 1 9.2 3.8 8.5 8.5 0 1 0 20.2 14.8Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SystemIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.8} />
      <Circle cx={12} cy={12} r={3} fill={color} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  label: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
  },
});
