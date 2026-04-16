import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function ClockSmallIcon({ color = '#E8313B', size = 20 }: SvgProps & { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
    >
      <Path
        d="M9.083 4.083v5l3.334 1.667m5-1.667a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
