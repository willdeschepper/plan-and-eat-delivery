import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

export function InfoSmallIcon({ color = '#FF7900', size = 20 }: SvgProps & { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <G clipPath="url(#clip0_2912_47627)">
        <Path
          d="M10 13.334V10m0-3.333h.008M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2912_47627">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
