import { cleanup, render, screen } from '@/lib/test-utils';

import { ForgotPasswordEmailForm } from './forgot-password-email-form';

afterEach(cleanup);

describe('forgotPasswordEmailForm', () => {
  it('disables submit when email invalid', () => {
    render(
      <ForgotPasswordEmailForm
        email="bad"
        onChangeEmail={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.getByTestId('forgot-email-submit')).toBeDisabled();
  });

  it('enables submit when email valid', () => {
    render(
      <ForgotPasswordEmailForm
        email="ok@example.com"
        onChangeEmail={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.getByTestId('forgot-email-submit')).not.toBeDisabled();
  });
});
