/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { PressableProps, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

const RIPPLE_SIZE = 600;
const DISABLED_COLOR = '#AEAEAE';

const VARIANT_ACTIVE_COLORS: Record<string, string> = {
  default: '#E8313B',
  secondary: '#FF6C00',
  destructive: '#dc2626',
  outline: 'transparent',
  ghost: 'transparent',
  link: 'transparent',
};

const RIPPLE_COLORS: Record<string, string> = {
  default: 'rgba(255,255,255,0.25)',
  secondary: 'rgba(255,255,255,0.25)',
  destructive: 'rgba(255,255,255,0.25)',
  outline: 'rgba(0,0,0,0.08)',
  ghost: 'rgba(0,0,0,0.08)',
  link: 'rgba(0,0,0,0.08)',
};

const ANIMATED_BG_VARIANTS = new Set(['default', 'secondary', 'destructive']);

const button = tv({
  slots: {
    container: 'my-2 mt-2 flex h-12 flex-row items-center justify-center rounded-full bg-danger-500 px-4',
    label: 'font-sans text-base font-semibold',
    indicator: 'h-6 text-white',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-danger-500',
        label: 'text-white',
        indicator: 'text-white',
      },
      secondary: {
        container: 'bg-primary-600',
        label: 'text-secondary-600',
        indicator: 'text-white',
      },
      outline: {
        container: 'border border-danger-500 bg-white',
        label: 'text-danger-500 dark:text-danger-500',
        indicator: 'text-danger-500 dark:text-danger-500',
      },
      destructive: {
        container: 'bg-red-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { container: 'size-9' },
      iconBig: { container: 'size-14 rounded-full border border-neutral-400' },
    },
    disabled: {
      true: {
        container: 'bg-[#AEAEAE] dark:bg-[#AEAEAE]',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-white',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: true,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
type Props = {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
} & ButtonVariants & Omit<PressableProps, 'disabled'>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type UseButtonAnimationsParams = {
  disabled: boolean;
  variant: string;
  onPressIn?: PressableProps['onPressIn'];
  onPressOut?: PressableProps['onPressOut'];
};

function useButtonAnimations({ disabled, variant, onPressIn, onPressOut }: UseButtonAnimationsParams) {
  const useAnimatedBg = ANIMATED_BG_VARIANTS.has(variant);
  const activeColor = VARIANT_ACTIVE_COLORS[variant] ?? '#000000';
  const rippleColor = RIPPLE_COLORS[variant] ?? 'rgba(255,255,255,0.25)';

  const scaleValue = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const disabledProgress = useSharedValue(disabled ? 1 : 0);

  React.useEffect(() => {
    disabledProgress.value = withTiming(disabled ? 1 : 0, { duration: 300 });
  }, [disabled, disabledProgress]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => {
    if (!useAnimatedBg) {
      return {};
    }

    return {
      backgroundColor: interpolateColor(
        disabledProgress.value,
        [0, 1],
        [activeColor, DISABLED_COLOR],
      ),
      borderRadius: 9999,
      overflow: 'hidden' as const,
    };
  });

  const rippleStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: RIPPLE_SIZE,
    height: RIPPLE_SIZE,
    borderRadius: RIPPLE_SIZE / 2,
    backgroundColor: rippleColor,
    left: rippleX.value - RIPPLE_SIZE / 2,
    top: rippleY.value - RIPPLE_SIZE / 2,
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const handlePressIn = React.useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      rippleX.value = e.nativeEvent.locationX;
      rippleY.value = e.nativeEvent.locationY;
      rippleScale.value = 0;
      rippleOpacity.value = 0.4;
      rippleScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
      rippleOpacity.value = withTiming(0, { duration: 500 });
      scaleValue.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      onPressIn?.(e);
    },
    [rippleX, rippleY, rippleScale, rippleOpacity, scaleValue, onPressIn],
  );

  const handlePressOut = React.useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scaleValue.value = withSpring(1.0, { damping: 10, stiffness: 200 });
      onPressOut?.(e);
    },
    [scaleValue, onPressOut],
  );

  return { scaleStyle, bgAnimatedStyle, rippleStyle, handlePressIn, handlePressOut, useAnimatedBg };
}

export function Button({ ref, label: text, loading = false, variant = 'default', disabled = true, size = 'default', className = '', testID, textClassName = '', ...props }: Props & { ref?: React.RefObject<View | null> }) {
  const styles = React.useMemo(
    () => button({ variant, disabled, size }),
    [variant, disabled, size],
  );

  const variantKey = variant ?? 'default';

  const { scaleStyle, bgAnimatedStyle, rippleStyle, handlePressIn, handlePressOut, useAnimatedBg } = useButtonAnimations({
    disabled: disabled ?? true,
    variant: variantKey,
    onPressIn: props.onPressIn,
    onPressOut: props.onPressOut,
  });

  const containerClassName = useAnimatedBg
    ? styles.container({ className }).replace(/(?:dark:)?bg-\S+/g, '')
    : styles.container({ className });

  return (
    <Animated.View style={[scaleStyle, useAnimatedBg ? bgAnimatedStyle : undefined, { marginTop: 12 }]}>
      <AnimatedPressable
        disabled={disabled || loading}
        className={containerClassName}
        style={useAnimatedBg ? undefined : { overflow: 'hidden' }}
        {...props}
        ref={ref}
        testID={testID}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {state => (
          <>
            <Animated.View style={rippleStyle} pointerEvents="none" />
            {props.children
              ? (typeof props.children === 'function' ? props.children(state) : props.children)
              : (
                  <>
                    {loading
                      ? (
                          <ActivityIndicator
                            size="small"
                            className={styles.indicator()}
                            testID={testID ? `${testID}-activity-indicator` : undefined}
                          />
                        )
                      : (
                          <Text
                            testID={testID ? `${testID}-label` : undefined}
                            className={styles.label({ className: textClassName })}
                          >
                            {text}
                          </Text>
                        )}
                  </>
                )}
          </>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}
