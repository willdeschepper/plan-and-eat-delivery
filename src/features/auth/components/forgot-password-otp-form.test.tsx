import { cleanup, render, screen } from '@/lib/test-utils';

import { ForgotPasswordOtpForm } from './forgot-password-otp-form';

afterEach(cleanup);

describe('forgotPasswordOtpForm', () => {
  it('renders forgot OTP copy and OTP inputs', () => {
    render(
      <ForgotPasswordOtpForm
        email="user@test.com"
        otp=""
        onChangeOtp={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        resendSeconds={0}
        onChangeEmail={jest.fn()}
        onResend={jest.fn()}
        formatResendTime={() => '0:00'}
      />,
    );
    expect(screen.getByText('Write your OTP code')).toBeOnTheScreen();
    expect(screen.getByTestId('otp-cell-0')).toBeOnTheScreen();
  });
});
