import type { SharedValue } from 'react-native-reanimated';
import * as React from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

import {
  buildLiquidPathD,
  WAVE_PHASE_CYCLE_MS,
} from '@/components/ui/loader/plan-eat-fill-wave';
import {
  PLAN_EAT_BRAND_RED,
  PLAN_EAT_WORDMARK_VIEW_BOX,
  PLAN_EAT_WORDMARK_VIEWBOX_HEIGHT,
  PLAN_EAT_WORDMARK_VIEWBOX_WIDTH,
  WORDMARK_PATH_D,
  WORDMARK_STROKE_WIDTH,
} from '@/components/ui/loader/plan-eat-wordmark-geometry';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type PlanEatFillLogoProps = {
  fillProgress: SharedValue<number>;
  color?: string;
  /** Rendered width; height follows viewBox aspect if omitted. */
  width?: number;
  height?: number;
};

export function PlanEatFillLogo({
  fillProgress,
  color = PLAN_EAT_BRAND_RED,
  width = PLAN_EAT_WORDMARK_VIEWBOX_WIDTH,
  height = PLAN_EAT_WORDMARK_VIEWBOX_HEIGHT,
}: PlanEatFillLogoProps): React.ReactElement {
  const clipId = React.useId().replace(/:/g, '');
  const wavePhase = useSharedValue(0);

  React.useEffect(() => {
    wavePhase.value = 0;
    wavePhase.value = withRepeat(
      withTiming(2 * Math.PI, { duration: WAVE_PHASE_CYCLE_MS }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(wavePhase);
    };
  }, [wavePhase]);

  const liquidPathProps = useAnimatedProps(() => ({
    d: buildLiquidPathD(fillProgress.value, wavePhase.value),
  }));

  return (
    <Svg width={width} height={height} viewBox={PLAN_EAT_WORDMARK_VIEW_BOX}>
      <Defs>
        <ClipPath id={clipId}>
          <Path d={WORDMARK_PATH_D} fillRule="evenodd" />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        <AnimatedPath
          fill={color}
          animatedProps={liquidPathProps}
        />
      </G>
      <Path
        d={WORDMARK_PATH_D}
        fill="none"
        fillRule="evenodd"
        strokeWidth={WORDMARK_STROKE_WIDTH}
      />
    </Svg>
  );
}
