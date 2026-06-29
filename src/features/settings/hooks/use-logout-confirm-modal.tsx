import * as React from 'react';

import { useGlobalModalController } from '@/lib/hooks/use-global-modal-controller';

import { LogoutConfirmModalContent } from '../components/logout-confirm-modal-content';

const LOGOUT_CONFIRM_MODAL_ID = 'settings-logout-confirm';

type Result = {
  openLogoutConfirm: () => void;
};

export function useLogoutConfirmModal(): Result {
  const modal = useGlobalModalController();

  const openLogoutConfirm = React.useCallback(() => {
    modal.openDialog({
      id: LOGOUT_CONFIRM_MODAL_ID,
      maxHeightPercent: 0.4,
      contentContainerStyle: {
        borderRadius: 32,
      },
      render: ({ close }) => (
        <LogoutConfirmModalContent onClose={close} />
      ),
    });
  }, [modal]);

  return { openLogoutConfirm };
}
