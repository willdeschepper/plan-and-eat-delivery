import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function PinIcon({ size = 24, color = '#E8313B' }: { size?: number; color?: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 22V11.143 22zM12 11.143c2.21 0 4-1.823 4-4.072C16 4.823 14.21 3 12 3S8 4.823 8 7.071c0 2.249 1.79 4.072 4 4.072z"
        fill={color}
      />
      <Path
        d="M12 22V11.143m0 0c2.21 0 4-1.823 4-4.072C16 4.823 14.21 3 12 3S8 4.823 8 7.071c0 2.249 1.79 4.072 4 4.072z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
