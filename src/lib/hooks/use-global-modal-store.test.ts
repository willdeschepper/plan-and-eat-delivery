/* eslint-disable max-lines-per-function -- store behavior covered in one suite */
import type { ModalEntry } from './use-global-modal-store';

import { act, renderHook } from '@testing-library/react-native';
import {

  useGlobalModalStore,
} from './use-global-modal-store';

function createMockEntry(id: string, presentation?: 'dialog' | 'sheet'): ModalEntry {
  return {
    id,
    render: () => null,
    ...(presentation && { presentation }),
  };
}

describe('useGlobalModalStore', () => {
  beforeEach(() => {
    act(() => {
      useGlobalModalStore.getState().closeAll();
    });
  });

  describe('policy: replace', () => {
    it('replaces stack with single entry', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      const entry = createMockEntry('a', 'dialog');

      act(() => {
        result.current.open(entry, 'replace');
      });

      expect(result.current.stack).toHaveLength(1);
      expect(result.current.stack[0]?.id).toBe('a');
      expect(result.current.getTop()?.id).toBe('a');
    });

    it('does not replace when same id is already on top (duplicate protection)', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      const entry = createMockEntry('same-id', 'dialog');

      act(() => {
        result.current.open(entry, 'replace');
      });
      const stackAfterFirst = result.current.stack;

      act(() => {
        result.current.open({ ...entry, render: () => null }, 'replace');
      });

      expect(result.current.stack).toBe(stackAfterFirst);
      expect(result.current.stack).toHaveLength(1);
    });

    it('replaces when different id', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.open(createMockEntry('b', 'dialog'), 'replace');
      });
      expect(result.current.stack).toHaveLength(1);
      expect(result.current.getTop()?.id).toBe('b');
    });
  });

  describe('policy: stack', () => {
    it('pushes entry on top of stack', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.open(createMockEntry('b', 'sheet'), 'stack');
      });
      expect(result.current.stack).toHaveLength(2);
      expect(result.current.getTop()?.id).toBe('b');
    });
  });

  describe('policy: queue', () => {
    it('enqueues when stack is not empty', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.open(createMockEntry('b', 'dialog'), 'queue');
      });
      expect(result.current.stack).toHaveLength(1);
      expect(result.current.queue).toHaveLength(1);
      expect(result.current.queue[0]?.id).toBe('b');
    });
  });

  describe('closeTop', () => {
    it('is idempotent when called multiple times', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.closeTop();
        result.current.closeTop();
        result.current.closeTop();
      });
      expect(result.current.stack).toHaveLength(0);
    });

    it('pops from stack and shows next from queue when stack empties', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.open(createMockEntry('b', 'dialog'), 'queue');
      });
      act(() => {
        result.current.closeTop();
      });
      expect(result.current.stack).toHaveLength(1);
      expect(result.current.stack[0]?.id).toBe('b');
      expect(result.current.queue).toHaveLength(0);
    });
  });

  describe('defaults', () => {
    it('normalizes entry with presentation dialog by default', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      const entry = createMockEntry('a', undefined);

      act(() => {
        result.current.open(entry, 'replace');
      });

      const top = result.current.getTop();
      expect(top?.presentation).toBe('dialog');
      expect(top?.dismissOnBackdrop).toBe(true);
      expect(top?.dismissOnBack).toBe(true);
      expect(top?.maxHeightPercent).toBe(0.85);
    });
  });

  describe('isOpen', () => {
    it('returns true when id is in stack', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      expect(result.current.isOpen('a')).toBe(true);
      expect(result.current.isOpen('b')).toBe(false);
    });

    it('returns true when id is in queue', () => {
      const { result } = renderHook(() => useGlobalModalStore());
      act(() => {
        result.current.open(createMockEntry('a', 'dialog'), 'replace');
      });
      act(() => {
        result.current.open(createMockEntry('b', 'dialog'), 'queue');
      });
      expect(result.current.isOpen('b')).toBe(true);
    });
  });
});
