import type { InputFieldForm } from '@/components/ui/input-field';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import { InputField } from '@/components/ui';

export type RegistrationFormWorkplaceFieldsProps = {
  form: InputFieldForm;
  visible: boolean;
};

export function RegistrationFormWorkplaceFields({ form, visible }: RegistrationFormWorkplaceFieldsProps) {
  const { t } = useTranslation();

  if (!visible)
    return null;

  return (
    <View>
      <InputField
        form={form}
        name="companyName"
        testID="registration-company-input"
        label={t('auth.registration.company_label')}
        placeholder={t('auth.registration.company_placeholder')}
        isPassword={false}
      />
      <InputField
        form={form}
        name="department"
        testID="registration-department-input"
        label={t('auth.registration.department_label')}
        placeholder={t('auth.registration.department_placeholder')}
        isPassword={false}
      />
    </View>
  );
}
