import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function ListIcon({ size = 20, color = '#E8313B' }: { size?: number; color?: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path
        d="M17.5 10h-10m10-5h-10m10 10h-10m-3.333-5A.833.833 0 112.5 10a.833.833 0 011.667 0zm0-5A.833.833 0 112.5 5a.833.833 0 011.667 0zm0 10A.833.833 0 112.5 15a.833.833 0 011.667 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
