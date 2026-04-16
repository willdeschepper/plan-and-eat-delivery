import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

export function CheckboxCircleIcon({
  size = 20,
  color = '#141414',
  style,
  filled = false,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  filled?: boolean;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      style={style}
    >
      {filled
        ? (
            <>
              <G clipPath="url(#clip0_2624_3066)">
                <Path
                  d="M18.333 9.238v.767a8.333 8.333 0 11-4.941-7.617m4.941.946L10 11.675l-2.5-2.5"
                  stroke="#2C583A"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_2624_3066">
                  <Path fill="#fff" d="M0 0H20V20H0z" />
                </ClipPath>
              </Defs>
            </>
          )
        : (
            <Path
              d="M9.083 17.417a8.333 8.333 0 100-16.667 8.333 8.333 0 000 16.667z"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
    </Svg>
  );
}
