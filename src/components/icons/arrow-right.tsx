import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function ArrowLeft({ transform = false, color = '#CCC', style }: { transform?: boolean; color?: string; style?: StyleProp<ViewStyle> }) {
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
        d="M20 12H4m0 0l6 6m-6-6l6-6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArrowRight({ color = '#CCC', style }: { color?: string; style?: StyleProp<ViewStyle> }) {
  return <ArrowLeft transform color={color} style={style} />;
}
