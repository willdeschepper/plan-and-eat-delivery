import type { TxKeyPath } from '@/lib/i18n';

import * as React from 'react';
import {
  Button,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib/i18n';

type OnboardingCardProps = {
  titleTx: TxKeyPath;
  descriptionTx: TxKeyPath;
  primaryActionLabelTx: TxKeyPath;
  onPrimaryAction: () => void;
};

export function OnboardingCard({
  titleTx,
  descriptionTx,
  primaryActionLabelTx,
  onPrimaryAction,
}: OnboardingCardProps) {
  return (
    <View
      className="mt-10 w-full rounded-[32px] border border-neutral-100 bg-[#FCFCFC] px-5 py-8 dark:border-neutral-700 dark:bg-neutral-800"
    >
      <Text
        tx={titleTx}
        className="mb-3 text-center font-montserrat-alternates text-[22px] font-semibold text-charcoal-900 dark:text-white"
      />

      <Text
        tx={descriptionTx}
        className="mb-6 text-center font-montserrat-alternates text-[14px] text-charcoal-600 dark:text-neutral-400"
      />

      <Button
        disabled={false}
        label={translate(primaryActionLabelTx)}
        textClassName="font-montserrat-alternates text-[16px]"
        onPress={onPrimaryAction}
      />
    </View>
  );
}
