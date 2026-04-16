import type {
  ModalEntry,
  ModalPolicy,
  ModalPresentation,
} from './use-global-modal-store';

import * as React from 'react';
import { useGlobalModalStore } from './use-global-modal-store';

export type OpenModalParams<TPayload = unknown> = Omit<
  ModalEntry<TPayload>,
  'presentation'
> & {
  policy?: ModalPolicy;
  presentation?: ModalPresentation;
};

type BaseOpenParams<TPayload = unknown> = Omit<
  OpenModalParams<TPayload>,
  'presentation'
>;

type GlobalModalController = {
  open: <TPayload = unknown>(params: OpenModalParams<TPayload>) => void;
  openDialog: <TPayload = unknown>(params: BaseOpenParams<TPayload>) => void;
  openSheet: <TPayload = unknown>(params: BaseOpenParams<TPayload>) => void;
  replace: <TPayload = unknown>(params: OpenModalParams<TPayload>) => void;
  close: () => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
};

export function useGlobalModalController(): GlobalModalController {
  const openFromStore = useGlobalModalStore(state => state.open);
  const replaceFromStore = useGlobalModalStore(state => state.replace);
  const closeTop = useGlobalModalStore(state => state.closeTop);
  const closeAllFromStore = useGlobalModalStore(state => state.closeAll);
  const isOpenFromStore = useGlobalModalStore(state => state.isOpen);

  const open = React.useCallback(
    <TPayload>(params: OpenModalParams<TPayload>) => {
      const { policy, ...entry } = params;
      openFromStore(entry as ModalEntry, policy);
    },
    [openFromStore],
  );

  const openDialog = React.useCallback(
    <TPayload>(params: BaseOpenParams<TPayload>) => {
      open({ ...params, presentation: 'dialog' });
    },
    [open],
  );

  const openSheet = React.useCallback(
    <TPayload>(params: BaseOpenParams<TPayload>) => {
      open({ ...params, presentation: 'sheet' });
    },
    [open],
  );

  const replace = React.useCallback(
    <TPayload>(params: OpenModalParams<TPayload>) => {
      const { policy: _ignoredPolicy, ...entry } = params;
      replaceFromStore(entry as ModalEntry);
    },
    [replaceFromStore],
  );

  const close = React.useCallback(() => {
    closeTop();
  }, [closeTop]);

  const closeAll = React.useCallback(() => {
    closeAllFromStore();
  }, [closeAllFromStore]);

  const isOpen = React.useCallback(
    (id: string) => isOpenFromStore(id),
    [isOpenFromStore],
  );

  return {
    open,
    openDialog,
    openSheet,
    replace,
    close,
    closeAll,
    isOpen,
  };
}
