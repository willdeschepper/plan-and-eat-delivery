import * as React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';

import { Button, Text } from '@/components/ui';

import { AuthFormHeader } from './auth-form-header';
import { AuthFormLayout } from './auth-form-layout';
import { OtpInput } from './otp-input';

export type OtpFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  resendLabel: string;
  email?: string;
  otp: string;
  onChangeOtp: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
  resendSeconds: number;
  onResend: () => void;
  formatResendTime: () => string;
  hasError?: boolean;
};

export function OtpForm({
  title,
  subtitle,
  submitLabel,
  resendLabel,
  otp,
  onChangeOtp,
  onSubmit,
  isSubmitting,
  resendSeconds,
  onResend,
  formatResendTime,
  hasError = false,
}: OtpFormProps) {
  return (
    <AuthFormLayout>
      <AuthFormHeader title={title} subtitle={subtitle} />
      <OtpInput value={otp} onChange={onChangeOtp} hasError={hasError} />
      <Button
        disabled={isSubmitting || otp.length < 6}
        label={submitLabel}
        variant="destructive"
        onPress={onSubmit}
        loading={isSubmitting}
      />
      <View className="mt-4 gap-2">
        {resendSeconds > 0 && (
          <Text className="text-center text-sm text-neutral-500">
            {formatResendTime()}
          </Text>
        )}
        <Pressable onPress={onResend} className="w-full">
          <RNText className="text-center text-base text-neutral-600 underline">
            {resendLabel}
          </RNText>
        </Pressable>
      </View>
    </AuthFormLayout>
  );
}
