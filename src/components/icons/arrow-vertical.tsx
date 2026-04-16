import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function ArrowVertical({ transform = false, color = '#141414', style }: { transform?: boolean; color?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      style={StyleSheet.flatten([
        style,
        { transform: [{ rotate: transform ? '180deg' : '0deg' }] },
      ])}
    >
      <Path
        d="M18 15l-6-6-6 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
