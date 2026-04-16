/* eslint-disable react-refresh/only-export-components */
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';

type ToastBannerVariant = 'success' | 'error' | 'warning' | 'info';

function toastBannerTone(variant: ToastBannerVariant): string {
  switch (variant) {
    case 'success':
      return 'border-success-300/80 bg-success-50 dark:border-success-600 dark:bg-charcoal-850';
    case 'error':
      return 'border-danger-300/80 bg-danger-50 dark:border-danger-700 dark:bg-charcoal-850';
    case 'warning':
      return 'border-warning-300/80 bg-warning-50 dark:border-warning-700 dark:bg-charcoal-850';
    case 'info':
      return 'border-primary-300/80 bg-primary-50 dark:border-primary-700 dark:bg-charcoal-850';
  }
}

function ToastBanner(
  props: ToastConfigParams<Record<string, never>>,
  variant: ToastBannerVariant,
): React.JSX.Element {
  const { text1, text2, onPress } = props;
  const hasDescription = !!text2 && text2.length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      className="mx-4"
      onPress={onPress}
    >
      <View
        className={`w-full flex-row items-center rounded-2xl border px-4 py-3 shadow-sm ${toastBannerTone(variant)}`}
      >
        <View className="w-full flex-1 flex-col">
          <Text
            className="font-sans text-base font-semibold text-charcoal-900 dark:text-charcoal-50"
            style={hasDescription ? { marginBottom: 4 } : undefined}
          >
            {text1}
          </Text>
          {hasDescription && (
            <Text className="font-sans text-sm text-charcoal-700 dark:text-charcoal-200">
              {text2}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function createToastBannerRenderer(variant: ToastBannerVariant) {
  return (params: ToastConfigParams<Record<string, never>>): React.JSX.Element => {
    return ToastBanner(params, variant);
  };
}

/** `react-native-toast-message` config for the root `<Toast />` in `_layout.tsx`. */
export const rootToastConfig: ToastConfig = {
  success: createToastBannerRenderer('success'),
  error: createToastBannerRenderer('error'),
  warning: createToastBannerRenderer('warning'),
  info: createToastBannerRenderer('info'),
};
