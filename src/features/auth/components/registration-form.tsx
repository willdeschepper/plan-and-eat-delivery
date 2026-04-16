import { useForm, useStore } from '@tanstack/react-form';
import { useRouter } from 'expo-router';

import * as React from 'react';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useSignUpFormValidators } from '@/lib/hooks';

import { RegistrationFormFields } from './registration-form-fields';
import { WorkplaceSelectionStep } from './workplace-selection-step';

export type RegistrationFormValues = {
  hasWorkplace: boolean | null;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type RegistrationFormProps = {
  onSubmit?: (data: RegistrationFormValues) => void;
};

const DEFAULT_VALUES: RegistrationFormValues = {
  hasWorkplace: null,
  name: '',
  surname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

export function RegistrationForm({ onSubmit = () => {} }: RegistrationFormProps) {
  const router = useRouter();
  const validators = useSignUpFormValidators();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        hasWorkplace: value.hasWorkplace ?? false,
      });
    },
  });

  const hasWorkplace = useStore(form.store, state => state.values.hasWorkplace);
  const [workplaceStep, setWorkplaceStep] = React.useState<'choose' | 'form'>('choose');
  const showForm = workplaceStep === 'form';
  const formValues = useStore(form.store, state => state.values);
  const handleSelectWorkplace = React.useCallback((value: boolean) => {
    form.setFieldValue('hasWorkplace', value);
  }, [form]);

  const handleWorkplaceContinue = React.useCallback(() => {
    if (hasWorkplace !== null)
      setWorkplaceStep('form');
  }, [hasWorkplace]);

  const isFormValid = React.useMemo(() => {
    if (!showForm)
      return false;
    const v = formValues;
    return (
      v.name.trim().length >= 2
      && v.email.trim().length > 0
      && v.password.trim().length >= 6
      && v.confirmPassword === v.password
      && v.phone.trim().length > 0
    );
  }, [showForm, formValues]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, marginTop: 90 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!showForm
          ? (
              <WorkplaceSelectionStep
                hasWorkplace={hasWorkplace}
                onSelect={handleSelectWorkplace}
                onContinue={handleWorkplaceContinue}
              />
            )
          : (
              <RegistrationFormFields
                form={form as any}
                hasWorkplace={hasWorkplace === true}
                validators={validators}
                isFormValid={isFormValid}
                onBack={() => router.back()}
              />
            )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
