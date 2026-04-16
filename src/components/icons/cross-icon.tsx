import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export function CrossIcon({ color = '#fff', withBackground = true }: SvgProps & { withBackground?: boolean }) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
    >
      <Rect width={30} height={30} rx={15} fill={withBackground ? '#E8313B' : 'transparent'} />
      <Path
        d="M20 10L10 20m0-10l10 10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
