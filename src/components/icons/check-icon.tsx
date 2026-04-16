import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function CheckIcon({
  size = 24,
  color = '#E8313B',
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
