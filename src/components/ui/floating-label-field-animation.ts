import type { TextInputProps } from 'react-native';
import * as React from 'react';
import { I18nManager } from 'react-native';
import {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import colors from './colors';

export const INPUT_LABEL_INSET = 20;
export const LABEL_TOP_REST = 14;
export const LABEL_TOP_FLOATING = -11;

export type InputFloatParams = {
  value: TextInputProps['value'];
  isFocussed: boolean;
  placeholder: string | undefined;
  label: string | undefined;
  hasError: boolean;
  isDisabled: boolean;
  isDark?: boolean;
};

export function useInputFloatAnimation(params: InputFloatParams) {
  const { value, isFocussed, placeholder, label, hasError, isDisabled, isDark = false } = params;

  const hasValue
    = typeof value === 'string' ? value.length > 0 : Boolean(value);

  const resolvedPlaceholder = placeholder ?? label;

  const floatTarget = isFocussed || hasValue ? 1 : 0;

  const floatProgress = useSharedValue(floatTarget);
  const isErrorSV = useSharedValue(hasError ? 1 : 0);
  const isDisabledSV = useSharedValue(isDisabled ? 1 : 0);

  React.useEffect(() => {
    floatProgress.value = withTiming(floatTarget, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  }, [floatTarget, floatProgress]);

  React.useEffect(() => {
    isErrorSV.value = hasError ? 1 : 0;
  }, [hasError, isErrorSV]);

  React.useEffect(() => {
    isDisabledSV.value = isDisabled ? 1 : 0;
  }, [isDisabled, isDisabledSV]);

  // Border colors adapt to dark/light mode
  const borderIdle   = isDark ? colors.charcoal[700] : colors.inputBorder.idle;   // #474747 : #CECECE
  const borderActive = isDark ? colors.charcoal[400] : colors.inputBorder.active; // #969696 : #BEBEBE

  const containerBorderStyle = useAnimatedStyle(() => {
    if (isErrorSV.value > 0.5) {
      return {
        borderWidth: 1,
        borderColor: colors.danger[600],
      };
    }
    if (isDisabledSV.value > 0.5) {
      return {
        borderWidth: 1,
        borderColor: isDark ? colors.charcoal[700] : colors.neutral[300],
      };
    }
    return {
      borderWidth: 1,
      borderColor: interpolateColor(
        floatProgress.value,
        [0, 1],
        [borderIdle, borderActive],
      ),
    };
  });

  const labelInset = INPUT_LABEL_INSET;
  const isRTL = I18nManager.isRTL;

  const labelWrapperStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: interpolate(floatProgress.value, [0, 1], [LABEL_TOP_REST, LABEL_TOP_FLOATING]),
    ...(isRTL ? { right: labelInset } : { left: labelInset }),
    opacity: interpolate(floatProgress.value, [0, 0.08, 1], [0, 1, 1]),
    zIndex: 1,
  }));

  const labelTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(floatProgress.value, [0, 1], [16, 14]),
    lineHeight: interpolate(floatProgress.value, [0, 1], [24, 21]),
  }));

  const inputPaddingStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(floatProgress.value, [0, 1], [0, 6]),
  }));

  const effectivePlaceholder = isFocussed || hasValue ? '' : resolvedPlaceholder;

  return {
    containerBorderStyle,
    labelWrapperStyle,
    labelTextStyle,
    inputPaddingStyle,
    effectivePlaceholder,
  };
}
