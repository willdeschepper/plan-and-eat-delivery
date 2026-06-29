import { BlurView } from 'expo-blur';
import { requireOptionalNativeModule } from 'expo-modules-core';
import * as React from 'react';
import { Platform, View } from 'react-native';

const expoBlurNativeModule = requireOptionalNativeModule('ExpoBlur');

/** True when the native ExpoBlur view manager is linked in the current binary. */
const isBlurNativeAvailable =
  Platform.OS === 'ios' && expoBlurNativeModule != null;

type Props = {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: object;
  children?: React.ReactNode;
  fallbackColor?: string;
};

function BlurFallback({
  style,
  children,
  fallbackColor,
  isDark,
}: {
  style?: object;
  children?: React.ReactNode;
  fallbackColor?: string;
  isDark: boolean;
}) {
  const defaultFallback = isDark
    ? 'rgba(10,10,10,0.82)'
    : 'rgba(250,250,250,0.82)';

  return (
    <View style={[style, { backgroundColor: fallbackColor ?? defaultFallback }]}>
      {children}
    </View>
  );
}

export function SafeBlurView({
  intensity = 50,
  tint = 'light',
  style,
  children,
  fallbackColor,
}: Props) {
  const isDark = tint === 'dark';

  if (Platform.OS === 'android' || !isBlurNativeAvailable) {
    return (
      <BlurFallback
        style={style}
        children={children}
        fallbackColor={fallbackColor}
        isDark={isDark}
      />
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={style}>
      {children}
    </BlurView>
  );
}
