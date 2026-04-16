import type { LoginFormProps } from './login-form';

import * as React from 'react';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { LoginForm } from './login-form';

jest.mock('expo-router', () => ({
  // eslint-disable-next-line react/no-unnecessary-use-prefix -- mock of expo-router API
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

afterEach(cleanup);

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn();

describe('loginForm Form ', () => {
  it('renders correctly', async () => {
    setup(<LoginForm />);
    expect(await screen.findByTestId('form-title')).toBeOnTheScreen();
    expect(screen.getByText('Welcome back')).toBeOnTheScreen();
  });

  it('should keep submit button disabled when values are empty', async () => {
    const { user } = setup(<LoginForm />);

    const button = screen.getByTestId('login-button');

    // изначально оба поля пусты, кнопка disabled
    expect(button).toBeDisabled();

    const numberInput = screen.getByTestId('number-input');
    const passwordInput = screen.getByTestId('password-input');

    // вводим только number — форма всё ещё невалидна
    await user.type(numberInput, '+1234567890');
    expect(screen.getByTestId('login-button')).toBeDisabled();

    // вводим пароль — оба поля непустые, кнопка становится активной
    await user.type(passwordInput, 'password');
    expect(screen.getByTestId('login-button')).not.toBeDisabled();
  });

  it('should call LoginForm with correct values when values are valid', async () => {
    onSubmitMock.mockClear();
    const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

    const button = screen.getByTestId('login-button');
    const numberInput = screen.getByTestId('number-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(numberInput, '+1234567890');
    await user.type(passwordInput, 'password');
    await user.press(button);
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        number: '+1234567890',
        password: 'password',
      }),
    );
  });
});
