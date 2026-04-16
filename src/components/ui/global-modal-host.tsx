import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ModalEntry, ModalPolicy } from '@/lib/hooks/use-global-modal-store';

import * as React from 'react';
import { useGlobalModalStore } from '@/lib/hooks/use-global-modal-store';
import { Modal } from './modal';

function getTopSheetEntry(stack: ModalEntry[]): ModalEntry | null {
  const top = stack[stack.length - 1];
  return top?.presentation === 'sheet' ? top : null;
}

const SHEET_SNAP_POINTS = ['50%', '85%'];

export function GlobalModalHost() {
  const stack = useGlobalModalStore(state => state.stack);
  const closeTop = useGlobalModalStore(state => state.closeTop);
  const closeAllFromStore = useGlobalModalStore(state => state.closeAll);
  const openFromStore = useGlobalModalStore(state => state.open);

  const bottomSheetRef = React.useRef<BottomSheetModal | null>(null);

  const currentEntry = getTopSheetEntry(stack);

  React.useEffect(() => {
    if (currentEntry) {
      bottomSheetRef.current?.present();
    }
    else {
      bottomSheetRef.current?.dismiss();
    }
  }, [currentEntry]);

  const handleClose = React.useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleCloseAll = React.useCallback(() => {
    closeAllFromStore();
    bottomSheetRef.current?.dismiss();
  }, [closeAllFromStore]);

  const handleReplace = React.useCallback(
    (entry: ModalEntry, policy?: ModalPolicy) => {
      openFromStore(entry, policy ?? 'replace');
    },
    [openFromStore],
  );

  if (!currentEntry) {
    return null;
  }

  const { snapPoints, render, payload } = currentEntry;

  return (
    <Modal
      ref={bottomSheetRef}
      index={0}
      detached
      snapPoints={snapPoints ?? SHEET_SNAP_POINTS}
      onDismiss={closeTop}
    >
      {render({
        close: handleClose,
        closeAll: handleCloseAll,
        replace: handleReplace,
        payload,
      })}
    </Modal>
  );
}
