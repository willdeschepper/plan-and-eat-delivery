import * as React from 'react';

import { Button } from '@/components/ui';

import { AuthFormHeader } from './auth-form-header';
import { AuthFormLayout } from './auth-form-layout';

export type AuthSingleFieldFormProps = {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  submitTestID?: string;
  headerTestID?: string;
  children: React.ReactNode;
};

export function AuthSingleFieldForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  loading = false,
  disabled = false,
  submitTestID,
  headerTestID,
  children,
}: AuthSingleFieldFormProps) {
  return (
    <AuthFormLayout>
      <AuthFormHeader title={title} subtitle={subtitle} testID={headerTestID} />
      {children}
      <Button
        testID={submitTestID}
        label={submitLabel}
        variant="destructive"
        onPress={onSubmit}
        loading={loading}
        disabled={disabled}
      />
    </AuthFormLayout>
  );
}
