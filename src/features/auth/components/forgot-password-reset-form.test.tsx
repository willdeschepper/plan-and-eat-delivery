import { cleanup, render, screen } from '@/lib/test-utils';

import { ForgotPasswordResetForm } from './forgot-password-reset-form';

afterEach(cleanup);

describe('forgotPasswordResetForm', () => {
  it('disables submit when password too short or mismatch', () => {
    render(
      <ForgotPasswordResetForm
        password="short"
        confirmPassword="short"
        onChangePassword={jest.fn()}
        onChangeConfirmPassword={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.getByText('Change password')).toBeDisabled();
  });

  it('enables submit when passwords match and meet minimum length', () => {
    render(
      <ForgotPasswordResetForm
        password="secret12"
        confirmPassword="secret12"
        onChangePassword={jest.fn()}
        onChangeConfirmPassword={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.getByText('Change password')).not.toBeDisabled();
  });
});
