import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/ui';
import { AuthFormHeader } from './auth-form-header';
import { WorkplaceOptionCard } from './workplace-option-card';

export type WorkplaceSelectionStepProps = {
  hasWorkplace: boolean | null;
  onSelect: (value: boolean) => void;
  onContinue: () => void;
};

export function WorkplaceSelectionStep({ hasWorkplace, onSelect, onContinue }: WorkplaceSelectionStepProps) {
  const { t } = useTranslation();
  const canContinue = hasWorkplace !== null;

  return (
    <View className="mt-10 size-full">
      <AuthFormHeader
        title={t('auth.registration.workplace_title')}
        subtitle={t('auth.registration.workplace_subtitle')}
      />
      <WorkplaceOptionCard
        testID="workplace-option-yes"
        label={t('auth.registration.option_yes')}
        selected={hasWorkplace === true}
        onPress={() => onSelect(true)}
        imageType="corp"
      />
      <WorkplaceOptionCard
        testID="workplace-option-no"
        label={t('auth.registration.option_no')}
        selected={hasWorkplace === false}
        onPress={() => onSelect(false)}
        imageType="own"
      />
      <Button
        testID="workplace-continue-button"
        label={t('auth.registration.continue')}
        variant="destructive"
        disabled={!canContinue}
        onPress={onContinue}
      />
    </View>
  );
}
