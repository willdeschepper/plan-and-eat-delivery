import { cleanup, render, renderHook, screen } from '@/lib/test-utils';

import { Modal, useModal } from './modal';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const actual = jest.requireActual('@gorhom/bottom-sheet/mock');
  const { View } = require('react-native');
  return {
    ...actual,
    BottomSheetModal: class MockBottomSheetModal extends React.Component {
      render() {
        const { handleComponent: Handle, children } = this.props as {
          handleComponent?: () => React.ReactNode;
          children?: React.ReactNode;
        };
        const childContent
          = typeof children === 'function' ? (children as () => React.ReactNode)() : children;
        return React.createElement(View, { testID: 'bottom-sheet-modal' }, Handle ? React.createElement(Handle) : null, childContent);
      }
    },
  };
});

afterEach(cleanup);

describe('useModal', () => {
  it('returns ref, present, and dismiss', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.present).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('present and dismiss can be called without throwing', () => {
    const { result } = renderHook(() => useModal());
    expect(() => result.current.present()).not.toThrow();
    expect(() => result.current.dismiss()).not.toThrow();
  });
});

describe('modal', () => {
  it('renders with title when title prop is passed', () => {
    render(
      <Modal title="Test Modal Title">
        <></>
      </Modal>,
    );
    expect(screen.getByText('Test Modal Title')).toBeOnTheScreen();
  });

  it('renders close button with accessibility label', () => {
    render(
      <Modal title="Modal">
        <></>
      </Modal>,
    );
    expect(
      screen.getByLabelText('close modal'),
    ).toBeOnTheScreen();
  });
});
