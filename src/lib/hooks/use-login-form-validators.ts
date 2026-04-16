import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

export function useLoginFormValidators() {
  const { t } = useTranslation();
  const numberSchema = React.useMemo(
    () =>
      z
        .string({ message: t('auth.validation.number_required') })
        .min(1, t('auth.validation.number_required')),
    [t],
  );
  const passwordSchema = React.useMemo(
    () =>
      z
        .string({ message: t('auth.validation.password_required') })
        .min(1, t('auth.validation.password_required'))
        .min(6, t('auth.validation.password_min_length')),
    [t],
  );
  const validateNumber = React.useCallback(
    ({ value }: { value: string }) => {
      const result = numberSchema.safeParse(value);
      if (result.success)
        return undefined;
      return result.error.issues[0]?.message ?? t('auth.validation.number_required');
    },
    [numberSchema, t],
  );
  const validatePassword = React.useCallback(
    ({ value }: { value: string }) => {
      const result = passwordSchema.safeParse(value);
      if (result.success)
        return undefined;
      return result.error.issues[0]?.message ?? t('auth.validation.password_required');
    },
    [passwordSchema, t],
  );
  return { validateNumber, validatePassword };
}
