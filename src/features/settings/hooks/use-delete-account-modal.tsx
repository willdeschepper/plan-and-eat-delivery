import * as React from 'react';

import { useGlobalModalController } from '@/lib/hooks/use-global-modal-controller';

import { DeleteAccountModalContent } from '../components/delete-account-modal-content';

const DELETE_ACCOUNT_MODAL_ID = 'settings-delete-account';

type Result = {
  openDeleteAccount: () => void;
};

export function useDeleteAccountModal(): Result {
  const modal = useGlobalModalController();

  const openDeleteAccount = React.useCallback(() => {
    modal.openDialog({
      id: DELETE_ACCOUNT_MODAL_ID,
      maxHeightPercent: 0.45,
      contentContainerStyle: {
        borderRadius: 32,
      },
      render: ({ close }) => (
        <DeleteAccountModalContent onClose={close} />
      ),
    });
  }, [modal]);

  return { openDeleteAccount };
}
