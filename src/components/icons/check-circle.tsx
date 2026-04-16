import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export function CheckCircle({
  size = 220,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
    >
      <Rect width={220} height={220} rx={110} fill="#F7FBF8" />
      <Rect x={20} y={20} width={180} height={180} rx={90} fill="#A9C8B3" />
      <Rect x={40} y={40} width={140} height={140} rx={70} fill="#2C583A" />
      <Path
        d="M143.333 85L97.5 130.833 76.666 110"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
