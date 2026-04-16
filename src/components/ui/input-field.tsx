import type { NInputProps } from './input';

import * as React from 'react';

import { getFieldError } from '@/components/ui/form-utils';
import { Input } from './input';

export type InputFieldValidators = {
  onChange?: (ctx: { value: string }) => string | undefined;
};

type FieldRenderProps = {
  state: { value: unknown };
  handleChange: (value: string) => void;
  handleBlur: () => void;
};

export type InputFieldForm = {
  Field: React.ComponentType<{
    name: string;
    validators?: InputFieldValidators;
    children: (field: FieldRenderProps) => React.ReactNode;
  }>;
};

export type InputFieldProps = Omit<
  NInputProps,
  'value' | 'onChangeText' | 'onBlur' | 'error'
> & {
  form: InputFieldForm;
  name: string;
  validators?: InputFieldValidators;
  testID?: string;
};

export function InputField({
  form,
  name,
  validators,
  testID,
  ...inputProps
}: InputFieldProps) {
  return (
    <form.Field name={name} validators={validators}>
      {field => (
        <Input
          {...inputProps}
          testID={testID}
          value={field.state.value as string}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          error={getFieldError(field)}
        />
      )}
    </form.Field>
  );
}
