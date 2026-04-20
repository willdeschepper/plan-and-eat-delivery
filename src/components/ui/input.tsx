/* eslint-disable max-lines-per-function */
/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { BlurEvent, FocusEvent, TextInputProps } from 'react-native';
import * as React from 'react';
import { I18nManager, TextInput as NTextInput, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { useAppTheme } from '@/lib/hooks/use-app-theme';
import { EyeIcon, EyeOffIcon } from '@/components/ui/password-toggle-icon';
import { useInputFloatAnimation } from './floating-label-field-animation';
import { Text } from './text';

const PLACEHOLDER_COLOR_LIGHT = '#A3A3A3'; // neutral-400 — visible but muted on white bg
const PLACEHOLDER_COLOR_DARK  = '#525252'; // neutral-600 — visible but muted on dark bg

const inputTv = tv({
  slots: {
    container:
      'relative mt-4 h-[52px] flex-row items-center justify-between overflow-visible rounded-[100px] bg-white px-5 dark:bg-neutral-900',
    label:
      'font-regular font-montserrat text-[#141414] dark:text-neutral-100',
    input:
      'font-regular min-h-0 flex-1 bg-transparent py-0 font-montserrat text-base text-[#141414] dark:text-white',
  },

  variants: {
    focused: {
      true: {
        input: '',
      },
    },
    error: {
      true: {
        container: '',
      },
    },
    disabled: {
      true: {
        input: 'text-neutral-500',
      },
    },
    compact: {
      true: { input: 'max-w-[90%]' },
      false: { input: '' },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export type InputType = 'text' | 'numeric' | 'phone' | 'email' | 'decimal' | 'url';

const INPUT_MODE_MAP: Record<InputType, TextInputProps['inputMode']> = {
  text: 'text',
  numeric: 'numeric',
  phone: 'tel',
  email: 'email',
  decimal: 'decimal',
  url: 'url',
};

export type NInputProps = {
  label?: string;
  disabled?: boolean;
  error?: string;
  compact?: boolean;
  isPassword?: boolean;
  setPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  passwordVisible?: boolean;
  type?: InputType;
} & TextInputProps;

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTextInput = Animated.createAnimatedComponent(NTextInput);

function useErrorOpacity(visible: boolean, duration = 200) {
  const errorVisible = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    errorVisible.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.quad),
    });
  }, [visible, duration, errorVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: errorVisible.value,
  }));

  return animatedStyle;
}

export function Input({ ref, ...props }: NInputProps & { ref?: React.RefObject<NTextInput | null> }) {
  const { isDark } = useAppTheme();
  const placeholderTextColor = isDark ? PLACEHOLDER_COLOR_DARK : PLACEHOLDER_COLOR_LIGHT;

  const {
    label,
    error,
    testID,
    type,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    placeholder,
    ...inputProps
  } = props;

  const resolvedInputMode = type ? INPUT_MODE_MAP[type] : inputProps.inputMode;
  const [isFocussed, setIsFocussed] = React.useState(false);

  const onBlur = (e: BlurEvent) => {
    setIsFocussed(false);
    onBlurProp?.(e);
  };

  const onFocus = (e: FocusEvent) => {
    setIsFocussed(true);
    onFocusProp?.(e);
  };

  const styles = inputTv({
    error: Boolean(error),
    focused: isFocussed,
    disabled: Boolean(props.disabled),
    compact: props.isPassword,
  });

  const {
    containerBorderStyle,
    labelWrapperStyle,
    labelTextStyle,
    inputPaddingStyle,
    effectivePlaceholder,
  } = useInputFloatAnimation({
    value: inputProps.value,
    isFocussed,
    placeholder,
    label,
    hasError: Boolean(error),
    isDisabled: Boolean(props.disabled),
    isDark,
  });

  const errorAnimatedStyle = useErrorOpacity(Boolean(error));

  const notchAlignClass = I18nManager.isRTL ? 'self-end' : 'self-start';
  const labelTextAlignClass = I18nManager.isRTL ? 'text-right' : 'text-left';

  return (
    <View>
      <Animated.View
        className={styles.container()}
        style={containerBorderStyle}
      >
        {label
          ? (
              <Animated.View style={labelWrapperStyle} pointerEvents="none">
                <View
                  className={`rounded-sm bg-white px-1 py-0.5 dark:bg-neutral-900 ${notchAlignClass}`}
                >
                  <AnimatedText
                    testID={testID ? `${testID}-label` : undefined}
                    className={`${styles.label()} ${labelTextAlignClass}`}
                    style={labelTextStyle}
                  >
                    {label}
                  </AnimatedText>
                </View>
              </Animated.View>
            )
          : null}
        <AnimatedTextInput
          testID={testID}
          ref={ref}
          secureTextEntry={props.isPassword && !props.passwordVisible}
          placeholder={effectivePlaceholder}
          placeholderTextColor={placeholderTextColor}
          className={styles.input()}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputProps}
          editable={props.disabled ? false : inputProps.editable !== false}
          inputMode={resolvedInputMode}
          style={[
            inputPaddingStyle,
            { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
            { textAlign: I18nManager.isRTL ? 'right' : 'left' },
            StyleSheet.flatten(inputProps.style),
          ]}
        />
        {props.isPassword
          ? (
              <Pressable
                onPress={() => props.setPasswordVisible?.(v => !v)}
                className="size-10 items-center justify-center"
                hitSlop={8}
                testID="password-toggle"
              >
                {props.passwordVisible
                  ? <EyeOffIcon size={22} />
                  : <EyeIcon size={22} />}
              </Pressable>
            )
          : null}
      </Animated.View>

      {error && (
        <AnimatedText
          testID={testID ? `${testID}-error` : undefined}
          className="mb-2 text-sm text-danger-400 dark:text-danger-600"
          style={errorAnimatedStyle}
          pointerEvents="none"
        >
          {error}
        </AnimatedText>
      )}
    </View>
  );
}
