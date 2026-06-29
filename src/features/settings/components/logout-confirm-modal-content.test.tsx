import { logoutWithBackend } from '@/features/auth/logout';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';

import { LogoutConfirmModalContent } from './logout-confirm-modal-content';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/features/auth/logout', () => ({
  logoutWithBackend: jest.fn().mockResolvedValue(undefined),
}));

const mockOnClose = jest.fn();
const mockLogoutWithBackend = logoutWithBackend as jest.Mock;

afterEach(cleanup);

describe('logoutConfirmModalContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls logoutWithBackend on confirm', async () => {
    const { user } = setup(<LogoutConfirmModalContent onClose={mockOnClose} />);
    await user.press(screen.getByTestId('logout-confirm-submit'));
    await waitFor(() => {
      expect(mockLogoutWithBackend).toHaveBeenCalled();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on cancel without logout', async () => {
    const { user } = setup(<LogoutConfirmModalContent onClose={mockOnClose} />);
    await user.press(screen.getByTestId('logout-confirm-cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockLogoutWithBackend).not.toHaveBeenCalled();
  });
});
