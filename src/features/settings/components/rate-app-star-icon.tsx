import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Polygon } from 'react-native-svg';

type Props = SvgProps & {
  active?: boolean;
};

export function RateAppStarIcon({ active = false, ...props }: Props) {
  const strokeColor = active ? '#FF6C00' : '#969696';

  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" {...props}>
      <Polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
