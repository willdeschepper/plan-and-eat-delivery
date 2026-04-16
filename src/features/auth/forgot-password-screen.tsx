import { useRouter } from 'expo-router';

import { Pressable } from 'react-native';

import { ArrowLeft } from '@/components/icons';
import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { useForgotPassword } from '@/lib/hooks';
import { ForgotPasswordEmailForm } from './components/forgot-password-email-form';
import { ForgotPasswordOtpForm } from './components/forgot-password-otp-form';
import { ForgotPasswordResetForm } from './components/forgot-password-reset-form';

export function ForgotPasswordScreen() {
  const router = useRouter();

  const {
    step,
    email,
    otp,
    password,
    confirmPassword,
    isSubmitting,
    resendSeconds,
    setStep,
    setEmail,
    setOtp,
    setPassword,
    setConfirmPassword,
    handleSubmitEmail,
    handleSubmitOtp,
    handleSubmitReset,
    handleResendCode,
    formatResendTime,
  } = useForgotPassword();

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar contentStyle="dark" />
      <Background fillScreen />

      <View className="flex-1 pt-10">
        <Pressable
          onPress={() => router.back()}
          className="top-8 left-2 z-10 size-10 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <ArrowLeft color="black" />
        </Pressable>

        {step === 'email' && (
          <ForgotPasswordEmailForm
            email={email}
            onChangeEmail={setEmail}
            onSubmit={handleSubmitEmail}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 'otp' && (
          <ForgotPasswordOtpForm
            email={email}
            otp={otp}
            onChangeOtp={setOtp}
            onSubmit={handleSubmitOtp}
            isSubmitting={isSubmitting}
            resendSeconds={resendSeconds}
            onChangeEmail={() => setStep('email')}
            onResend={handleResendCode}
            formatResendTime={formatResendTime}
          />
        )}

        {step === 'reset' && (
          <ForgotPasswordResetForm
            password={password}
            confirmPassword={confirmPassword}
            onChangePassword={setPassword}
            onChangeConfirmPassword={setConfirmPassword}
            onSubmit={handleSubmitReset}
            isSubmitting={isSubmitting}
          />
        )}
      </View>
    </View>
  );
}
