import { cleanup, render, screen, setup } from '@/lib/test-utils';

import { OtpForm } from './otp-form';

afterEach(cleanup);

const baseProps = {
  title: 'OTP title',
  subtitle: 'OTP subtitle',
  submitLabel: 'Verify',
  resendLabel: 'Resend',
  onChangeOtp: jest.fn(),
  onSubmit: jest.fn(),
  isSubmitting: false,
  resendSeconds: 0,
  onResend: jest.fn(),
  formatResendTime: () => '0:30',
};

describe('otpForm', () => {
  it('disables submit when OTP shorter than 6', () => {
    render(<OtpForm {...baseProps} otp="12345" />);
    expect(screen.getByText('Verify')).toBeDisabled();
  });

  it('enables submit when OTP has 6 digits', () => {
    render(<OtpForm {...baseProps} otp="123456" />);
    expect(screen.getByText('Verify')).not.toBeDisabled();
  });

  it('calls onResend when resend pressed', async () => {
    const onResend = jest.fn();
    const { user } = setup(<OtpForm {...baseProps} onResend={onResend} otp="123456" />);
    await user.press(screen.getByText('Resend'));
    expect(onResend).toHaveBeenCalledTimes(1);
  });
});
