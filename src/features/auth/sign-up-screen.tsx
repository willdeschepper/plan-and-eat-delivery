import type { RegistrationFormValues } from './components/registration-form';
import { useRouter } from 'expo-router';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { showParsedApiError } from '@/lib/api/errors';
import { logRegistrationFailure } from '@/lib/api/log-registration-debug';
import { assertOnline } from '@/lib/network';
import { useRegisterCustomer } from './api';
import { RegistrationForm } from './components/registration-form';

export function SignUpScreen() {
  const router = useRouter();
  const { mutateAsync: registerCustomer } = useRegisterCustomer();

  const handleSubmit = async (data: RegistrationFormValues) => {
    if (!assertOnline()) {
      return;
    }
    try {
      await registerCustomer({
        name: data.name,
        surname: data.surname,
        email: data.email,
        is_corporate_user: true,
        mobile: data.phone,
        password: data.password,
        password2: data.confirmPassword,
      });

      router.push({
        pathname: '/verify-otp',
        params: { email: data.email },
      });
    }
    catch (error) {
      logRegistrationFailure('register', error);
      showParsedApiError(error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar contentStyle="dark" />
      <Background fillScreen />

      <View className="mt-10 flex-1">
        <RegistrationForm onSubmit={handleSubmit} />
      </View>
    </View>
  );
}
