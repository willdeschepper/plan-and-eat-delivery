import Toast from 'react-native-toast-message';

import { TOAST_VISIBILITY_MS } from '@/components/ui/toast-constants';

import { showErrorMessage } from './utils';

jest.mock('react-native-toast-message', () => {
  const show = jest.fn();
  const hide = jest.fn();
  const ToastComponent = Object.assign(
    () => {
      return null;
    },
    { show, hide },
  );
  return { __esModule: true, default: ToastComponent };
});

describe('showErrorMessage', () => {
  it('calls Toast.show with message and error type', () => {
    (Toast.show as jest.Mock).mockClear();
    showErrorMessage('Custom error');
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Custom error',
        type: 'error',
        visibilityTime: TOAST_VISIBILITY_MS,
        position: 'top',
      }),
    );
  });

  it('uses default message when not provided', () => {
    (Toast.show as jest.Mock).mockClear();
    showErrorMessage();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Something went wrong',
        type: 'error',
        position: 'top',
      }),
    );
  });
});
