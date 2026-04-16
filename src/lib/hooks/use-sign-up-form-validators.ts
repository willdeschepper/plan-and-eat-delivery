import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignUpFormValidators = {
  validateName: (ctx: { value: string }) => string | undefined;
  validateEmail: (ctx: { value: string }) => string | undefined;
  validatePassword: (ctx: { value: string }) => string | undefined;
  validateConfirmPassword: (ctx: { value: string }, password: string) => string | undefined;
  validatePhone: (ctx: { value: string }) => string | undefined;
};

export function useSignUpFormValidators(): SignUpFormValidators {
  const { t } = useTranslation();

  const nameSchema = React.useMemo(
    () =>
      z
        .string({ message: t('auth.validation.name_required') })
        .min(1, t('auth.validation.name_required'))
        .min(2, t('auth.validation.name_min_length')),
    [t],
  );

  const emailSchema = React.useMemo(
    () =>
      z
        .string({ message: t('auth.validation.email_required') })
        .min(1, t('auth.validation.email_required'))
        .refine(val => EMAIL_REGEX.test(val.trim()), t('auth.validation.email_invalid')),
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

  const validateName = React.useCallback(
    ({ value }: { value: string }) => {
      const result = nameSchema.safeParse(value);
      if (result.success)
        return undefined;
      return result.error.issues[0]?.message ?? t('auth.validation.name_required');
    },
    [nameSchema, t],
  );

  const validateEmail = React.useCallback(
    ({ value }: { value: string }) => {
      const result = emailSchema.safeParse(value);
      if (result.success)
        return undefined;
      return result.error.issues[0]?.message ?? t('auth.validation.email_required');
    },
    [emailSchema, t],
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

  const validateConfirmPassword = React.useCallback(
    ({ value }: { value: string }, password: string) => {
      if (!value.trim())
        return t('auth.validation.password_required');
      if (value !== password)
        return t('auth.validation.confirm_password_mismatch');
      return undefined;
    },
    [t],
  );

  const validatePhone = React.useCallback(
    ({ value }: { value: string }) => {
      if (!value.trim())
        return t('auth.validation.phone_required');
      return undefined;
    },
    [t],
  );

  return {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validatePhone,
  };
}
