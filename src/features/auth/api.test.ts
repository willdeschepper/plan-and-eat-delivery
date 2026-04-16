import {
  useCustomerLogin,
  useForgotPasswordRequest,
  useLogout,
  useRefreshToken,
  useRegisterCustomer,
  useResendRegistrationOtp,
  useSetPassword,
  useVerifyAccount,
  useVerifyForgotPassword,
} from './api';

let authClientPostMock: jest.Mock;

jest.mock('@/lib/api', () => {
  const post = jest.fn();
  authClientPostMock = post;
  return { client: { post } };
});

describe('features/auth api mutations', () => {
  beforeEach(() => {
    authClientPostMock.mockReset();
    authClientPostMock.mockResolvedValue({ data: {} });
  });

  it('useRegisterCustomer mutationFn posts register payload', async () => {
    const body = {
      name: 'N',
      surname: 'S',
      email: 'e@e.com',
      is_corporate_user: false,
      mobile: '+1',
      password: 'p',
      password2: 'p',
    };
    authClientPostMock.mockResolvedValueOnce({ data: { id: 1 } });
    await useRegisterCustomer.mutationFn(body);
    expect(authClientPostMock).toHaveBeenCalledWith(
      '/api/customers/register/',
      body,
    );
  });

  it('useVerifyAccount mutationFn posts verify payload', async () => {
    authClientPostMock.mockResolvedValueOnce({
      data: { token: { access: 'a', refresh: 'r' } },
    });
    await useVerifyAccount.mutationFn({ email: 'e@e.com', code: '123456' });
    expect(authClientPostMock).toHaveBeenCalledWith('/api/customers/verify/', {
      email: 'e@e.com',
      code: '123456',
    });
  });

  it('useResendRegistrationOtp mutationFn posts resend-otp', async () => {
    await useResendRegistrationOtp.mutationFn({ email: 'e@e.com' });
    expect(authClientPostMock).toHaveBeenCalledWith(
      '/api/customers/resend-otp/',
      { email: 'e@e.com' },
    );
  });

  it('useRefreshToken mutationFn posts refresh', async () => {
    authClientPostMock.mockResolvedValueOnce({
      data: { access: 'na', refresh: 'nr' },
    });
    await useRefreshToken.mutationFn({ refresh: 'old' });
    expect(authClientPostMock).toHaveBeenCalledWith('/api/customers/refresh/', {
      refresh: 'old',
    });
  });

  it('useForgotPasswordRequest mutationFn posts forgot-password', async () => {
    await useForgotPasswordRequest.mutationFn({ email: 'e@e.com' });
    expect(authClientPostMock).toHaveBeenCalledWith(
      '/api/customers/forgot-password/',
      { email: 'e@e.com' },
    );
  });

  it('useVerifyForgotPassword mutationFn posts verify-forgot-password', async () => {
    authClientPostMock.mockResolvedValueOnce({
      data: { token: { access: 'a', refresh: 'r' } },
    });
    await useVerifyForgotPassword.mutationFn({
      email: 'e@e.com',
      code: '123456',
    });
    expect(authClientPostMock).toHaveBeenCalledWith(
      '/api/customers/verify-forgot-password/',
      { email: 'e@e.com', code: '123456' },
    );
  });

  it('useSetPassword mutationFn posts set-password', async () => {
    await useSetPassword.mutationFn({ password: 'p', password2: 'p' });
    expect(authClientPostMock).toHaveBeenCalledWith(
      '/api/customers/set-password/',
      { password: 'p', password2: 'p' },
    );
  });

  it('useLogout mutationFn posts logout with refresh', async () => {
    await useLogout.mutationFn({ refresh: 'r' });
    expect(authClientPostMock).toHaveBeenCalledWith('/api/customers/logout/', {
      refresh: 'r',
    });
  });

  it('useCustomerLogin mutationFn posts login', async () => {
    authClientPostMock.mockResolvedValueOnce({
      data: { token: { access: 'a', refresh: 'r' } },
    });
    await useCustomerLogin.mutationFn({ email: 'e@e.com', password: 'secret' });
    expect(authClientPostMock).toHaveBeenCalledWith('/api/customers/login/', {
      email: 'e@e.com',
      password: 'secret',
    });
  });
});
