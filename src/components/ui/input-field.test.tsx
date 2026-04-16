import type { InputFieldForm } from './input-field';

import { cleanup, render, screen } from '@/lib/test-utils';
import { InputField } from './input-field';

afterEach(cleanup);

function createMockForm(overrides: {
  value?: string;
  errors?: unknown[];
}): InputFieldForm {
  const { value = '', errors = [] } = overrides;
  const Field: InputFieldForm['Field'] = ({ children }) => {
    const field = {
      state: {
        value,
        meta: { errors },
      },
      handleChange: () => {},
      handleBlur: () => {},
    };
    return <>{children(field)}</>;
  };
  return { Field };
}

describe('inputField', () => {
  it('renders Input with value, onChangeText, onBlur and error from form Field', () => {
    const form = createMockForm({ value: 'hello', errors: [] });
    render(
      <InputField form={form} name="email" testID="email-input" />,
    );
    const input = screen.getByTestId('email-input');
    expect(input).toBeOnTheScreen();
    expect(input.props.value).toBe('hello');
  });

  it('displays field error when form Field provides errors', () => {
    const form = createMockForm({
      value: '',
      errors: ['Invalid email'],
    });
    render(
      <InputField form={form} name="email" testID="email-input" />,
    );
    expect(screen.getByText('Invalid email')).toBeOnTheScreen();
  });

  it('displays Zod-style error message when error is object with message', () => {
    const form = createMockForm({
      value: '',
      errors: [{ message: 'Required' }],
    });
    render(
      <InputField form={form} name="email" testID="email-input" />,
    );
    expect(screen.getByText('Required')).toBeOnTheScreen();
  });
});
