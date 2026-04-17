import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

let BlurView: React.ComponentType<{
  intensity?: number;
  tint?: string;
  style?: object;
  children?: React.ReactNode;
}> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('expo-blur');
  BlurView = mod.BlurView ?? null;
} catch {
  BlurView = null;
}

type Props = {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: object;
  children?: React.ReactNode;
  fallbackColor?: string;
};

export function SafeBlurView({ intensity = 50, tint = 'light', style, children, fallbackColor }: Props) {
  const isDark = tint === 'dark';

  const defaultFallback = isDark
    ? 'rgba(10,10,10,0.82)'
    : 'rgba(250,250,250,0.82)';

  if (Platform.OS === 'android' || !BlurView) {
    return (
      <View style={[style, { backgroundColor: fallbackColor ?? defaultFallback }]}>
        {children}
      </View>
    );
  }

  const B = BlurView;
  return (
    <B intensity={intensity} tint={tint} style={style}>
      {children}
    </B>
  );
}
