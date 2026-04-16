import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { ArrowLeft } from '@/components/icons';
import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { useRegistrationOtp } from '@/lib/hooks';
import { OtpForm } from './components/otp-form';

export function VerifyOtpScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    email,
    otp,
    setOtp,
    isSubmitting,
    resendSeconds,
    hasError,
    handleSubmitOtp,
    handleResend,
    formatResendTime,
  } = useRegistrationOtp();

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

        <OtpForm
          title={t('auth.otp.registration_title')}
          subtitle={t('auth.otp.registration_subtitle', { email })}
          submitLabel={t('auth.otp.confirm')}
          resendLabel={`${t('auth.otp.didnt_receive')} ${t('auth.otp.resend')}`}
          otp={otp}
          onChangeOtp={setOtp}
          onSubmit={handleSubmitOtp}
          isSubmitting={isSubmitting}
          resendSeconds={resendSeconds}
          onResend={handleResend}
          formatResendTime={formatResendTime}
          hasError={hasError}
        />
      </View>
    </View>
  );
}
