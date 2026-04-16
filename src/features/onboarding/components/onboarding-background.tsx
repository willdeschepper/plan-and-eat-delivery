import type { SharedValue } from 'react-native-reanimated';
import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import {
  buildConnectorPath,
  getOnboardingBackgroundLayout,
} from './onboarding-background-geometry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export type OnboardingBackgroundProps = SvgProps & {
  carouselProgress: SharedValue<number>;
};

export function OnboardingBackground({
  style,
  carouselProgress,
  ...props
}: OnboardingBackgroundProps) {
  const connectorProps = useAnimatedProps(() => {
    const { primary, secondary } = getOnboardingBackgroundLayout(
      carouselProgress.value,
    );
    return {
      d: buildConnectorPath(primary, secondary),
    };
  });

  const primaryOrbitProps = useAnimatedProps(() => {
    const { primary } = getOnboardingBackgroundLayout(carouselProgress.value);
    return {
      cx: primary.cx,
      cy: primary.cy,
    };
  });

  const primaryFillProps = useAnimatedProps(() => {
    const { primary } = getOnboardingBackgroundLayout(carouselProgress.value);
    return {
      cx: primary.cx,
      cy: primary.cy,
    };
  });

  const secondaryFillProps = useAnimatedProps(() => {
    const { secondary } = getOnboardingBackgroundLayout(carouselProgress.value);
    return {
      cx: secondary.cx,
      cy: secondary.cy,
    };
  });

  return (
    <Svg
      width={450}
      height={679}
      viewBox="0 0 402 679"
      fill="none"
      style={style}
      {...props}
    >
      <AnimatedPath
        stroke="#EFEFEF"
        animatedProps={connectorProps}
      />
      <AnimatedCircle
        r={163}
        stroke="#EFEFEF"
        fill="none"
        animatedProps={primaryOrbitProps}
      />
      <AnimatedCircle
        r={86.5}
        fill="#FEF6F6"
        animatedProps={primaryFillProps}
      />
      <AnimatedCircle
        r={54}
        fill="#FEF6F6"
        animatedProps={secondaryFillProps}
      />
    </Svg>
  );
}
