import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { client } from '@/lib/api';

export type TokenDto = {
  access: string;
  refresh: string;
};

export type CustomerRegisterRequest = {
  name: string;
  surname: string;
  email: string;
  is_corporate_user: boolean;
  mobile: string;
  password: string;
  password2: string;
};

export type VerifyAccountRequest = {
  email: string;
  code: string;
};

export type VerifyAccountResponse = {
  token: TokenDto;
};

export type ResendOtpRequest = {
  email: string;
};

export type RefreshTokenRequest = {
  refresh: string;
};

export type RefreshTokenResponse = {
  access: string;
  refresh?: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyForgotPasswordRequest = {
  email: string;
  code: string;
};

export type VerifyForgotPasswordResponse = {
  token: TokenDto;
};

export type SetPasswordRequest = {
  password: string;
  password2: string;
};

export type LogoutRequest = {
  refresh: string;
};

export type CustomerLoginRequest = {
  email: string;
  password: string;
};

export type CustomerLoginResponse = {
  token: TokenDto;
};

export const useRegisterCustomer = createMutation<
  unknown,
  CustomerRegisterRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/register/', variables)
      .then(response => response.data),
});

export const useVerifyAccount = createMutation<
  VerifyAccountResponse,
  VerifyAccountRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/verify/', variables)
      .then(response => response.data),
});

export const useResendRegistrationOtp = createMutation<
  unknown,
  ResendOtpRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/resend-otp/', variables)
      .then(response => response.data),
});

export const useRefreshToken = createMutation<
  RefreshTokenResponse,
  RefreshTokenRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/refresh/', variables)
      .then(response => response.data),
});

export const useForgotPasswordRequest = createMutation<
  unknown,
  ForgotPasswordRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/forgot-password/', variables)
      .then(response => response.data),
});

export const useVerifyForgotPassword = createMutation<
  VerifyForgotPasswordResponse,
  VerifyForgotPasswordRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/verify-forgot-password/', variables)
      .then(response => response.data),
});

export const useSetPassword = createMutation<
  unknown,
  SetPasswordRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/set-password/', variables)
      .then(response => response.data),
});

export const useLogout = createMutation<
  unknown,
  LogoutRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/logout/', variables)
      .then(response => response.data),
});

export const useCustomerLogin = createMutation<
  CustomerLoginResponse,
  CustomerLoginRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/customers/login/', variables)
      .then(response => response.data),
});
