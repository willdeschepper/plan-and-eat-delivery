import type * as React from 'react';
import type { ViewStyle } from 'react-native';

import { create } from 'zustand';

export type ModalPolicy = 'replace' | 'stack' | 'queue';

export type ModalPresentation = 'dialog' | 'sheet';

export type ModalRenderContext<TPayload = unknown> = {
  close: () => void;
  closeAll: () => void;
  replace: (entry: ModalEntry<TPayload>, policy?: ModalPolicy) => void;
  payload?: TPayload;
};

export type ModalEntry<TPayload = unknown> = {
  id: string;
  title?: string;
  snapPoints?: (string | number)[];
  render: (ctx: ModalRenderContext<TPayload>) => React.ReactNode;
  payload?: TPayload;
  /** @default 'dialog' */
  presentation?: ModalPresentation;
  /** Max height as fraction of screen (e.g. 0.85 = 85%). @default 0.85 */
  maxHeightPercent?: number;
  /** @default true */
  dismissOnBackdrop?: boolean;
  /** @default true */
  dismissOnBack?: boolean;
  contentContainerStyle?: ViewStyle;
};

let isClosingRef = false;

const DEFAULT_ENTRY: Partial<ModalEntry> = {
  presentation: 'dialog',
  dismissOnBackdrop: true,
  dismissOnBack: true,
  maxHeightPercent: 0.85,
};

function normalizeEntry(entry: ModalEntry): ModalEntry {
  return { ...DEFAULT_ENTRY, ...entry } as ModalEntry;
}

type GlobalModalState = {
  stack: ModalEntry[];
  queue: ModalEntry[];
  policyDefault: ModalPolicy;
  getTop: () => ModalEntry | null;
  open: (entry: ModalEntry, policy?: ModalPolicy) => void;
  replace: (entry: ModalEntry) => void;
  push: (entry: ModalEntry) => void;
  enqueue: (entry: ModalEntry) => void;
  closeTop: () => void;
  closeById: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
};

export const useGlobalModalStore = create<GlobalModalState>((set, get) => ({
  stack: [],
  queue: [],
  policyDefault: 'replace',

  getTop: () => {
    const { stack } = get();
    return stack.length > 0 ? (stack[stack.length - 1] ?? null) : null;
  },

  open: (entry, policy) => {
    const effectivePolicy = policy ?? get().policyDefault;
    const { stack } = get();
    const normalized = normalizeEntry(entry);

    if (effectivePolicy === 'replace') {
      const top = stack[stack.length - 1];
      if (top?.id === normalized.id) {
        return;
      }
      set({ stack: [normalized], queue: [] });
      return;
    }

    if (effectivePolicy === 'stack') {
      set({ stack: [...stack, normalized] });
      return;
    }

    // queue policy
    if (stack.length === 0) {
      set({ stack: [normalized] });
    }
    else {
      set(state => ({ queue: [...state.queue, normalized] }));
    }
  },

  replace: (entry) => {
    get().open(entry, 'replace');
  },

  push: (entry) => {
    get().open(entry, 'stack');
  },

  enqueue: (entry) => {
    get().open(entry, 'queue');
  },

  closeTop: () => {
    if (isClosingRef) {
      return;
    }
    const { stack, queue } = get();
    if (stack.length === 0) {
      return;
    }
    isClosingRef = true;

    const newStack = stack.slice(0, -1);

    if (newStack.length > 0) {
      set({ stack: newStack });
    }
    else if (queue.length > 0) {
      const [next, ...restQueue] = queue;
      set({ stack: [next], queue: restQueue });
    }
    else {
      set({ stack: [], queue: [] });
    }

    queueMicrotask(() => {
      isClosingRef = false;
    });
  },

  closeById: (id) => {
    const { stack, queue } = get();
    const newStack = stack.filter(entry => entry.id !== id);
    const newQueue = queue.filter(entry => entry.id !== id);
    set({ stack: newStack, queue: newQueue });
  },

  closeAll: () => {
    set({ stack: [], queue: [] });
  },

  isOpen: (id) => {
    const { stack, queue } = get();
    return (
      stack.some(entry => entry.id === id)
      || queue.some(entry => entry.id === id)
    );
  },
}));
