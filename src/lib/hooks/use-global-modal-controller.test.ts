import { act, renderHook } from '@testing-library/react-native';

import { useGlobalModalController } from './use-global-modal-controller';
import { useGlobalModalStore } from './use-global-modal-store';

function createMockEntry(id: string) {
  return {
    id,
    render: () => null,
  };
}

describe('useGlobalModalController', () => {
  beforeEach(() => {
    act(() => {
      useGlobalModalStore.getState().closeAll();
    });
  });

  it('openDialog sets presentation to dialog', () => {
    const { result: ctrl } = renderHook(() => useGlobalModalController());

    act(() => {
      ctrl.current.openDialog(createMockEntry('dialog-1'));
    });

    const stack = useGlobalModalStore.getState().stack;
    expect(stack).toHaveLength(1);
    expect(stack[0]?.presentation).toBe('dialog');
  });

  it('openSheet sets presentation to sheet', () => {
    const { result: ctrl } = renderHook(() => useGlobalModalController());

    act(() => {
      ctrl.current.openSheet(createMockEntry('sheet-1'));
    });

    const stack = useGlobalModalStore.getState().stack;
    expect(stack).toHaveLength(1);
    expect(stack[0]?.presentation).toBe('sheet');
  });

  it('close removes top entry', () => {
    const { result: ctrl } = renderHook(() => useGlobalModalController());

    act(() => {
      ctrl.current.openDialog(createMockEntry('a'));
    });
    expect(useGlobalModalStore.getState().stack).toHaveLength(1);

    act(() => {
      ctrl.current.close();
    });
    expect(useGlobalModalStore.getState().stack).toHaveLength(0);
  });

  it('isOpen returns correct value', () => {
    const { result: ctrl } = renderHook(() => useGlobalModalController());

    expect(ctrl.current.isOpen('x')).toBe(false);

    act(() => {
      ctrl.current.openDialog(createMockEntry('x'));
    });
    expect(ctrl.current.isOpen('x')).toBe(true);

    act(() => {
      ctrl.current.close();
    });
    expect(ctrl.current.isOpen('x')).toBe(false);
  });
});
