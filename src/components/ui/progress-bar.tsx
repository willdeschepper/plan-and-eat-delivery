/* eslint-disable react/no-forward-ref */
import * as React from 'react';
import { useEffect, useImperativeHandle } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

type Props = {
  totalSteps: number;
  currentStep: number;
  className?: string;
  testID?: string;
};

export type ProgressBarRef = {
  goToStep: (step: number) => void;
};

type SegmentProps = {
  index: number;
  isLast: boolean;
  progress: ReturnType<typeof useSharedValue<number>>;
};

const ProgressSegment = React.memo<SegmentProps>(({ index, isLast, progress }) => {
  const fillRatio = useDerivedValue(
    () =>
      interpolate(
        progress.value,
        [index, index + 1],
        [0, 1],
        'clamp',
      ),
    [progress],
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillRatio.value * 100}%`,
  }));

  return (
    <View
      style={{
        flex: 1,
        marginRight: isLast ? 0 : 4,
        backgroundColor: '#E3ECE6',
        height: 6,
        borderRadius: 999,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: '#2C583A',
            height: 6,
            borderRadius: 999,
          },
          fillStyle,
        ]}
      />
    </View>
  );
});

export const ProgressBar = React.forwardRef<ProgressBarRef, Props>(
  ({ totalSteps, currentStep, className = '', testID }, ref) => {
    const progress = useSharedValue<number>(currentStep);

    useImperativeHandle(
      ref,
      () => ({
        goToStep: (step: number) => {
          progress.value = withTiming(step, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          });
        },
      }),
      [progress],
    );

    useEffect(() => {
      progress.value = withTiming(currentStep, {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      });
    }, [currentStep, progress]);

    const indices = React.useMemo(
      () => Array.from({ length: totalSteps }).map((_, index) => index),
      [totalSteps],
    );

    return (
      <View
        testID={testID}
        className={twMerge('flex-row items-center', className)}
      >
        {indices.map(index => (
          <ProgressSegment

            key={index}
            index={index}
            isLast={index === totalSteps - 1}
            progress={progress}
          />
        ))}
      </View>
    );
  },
);
