import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { useGlobalModalStore } from '@/lib/hooks/use-global-modal-store';
import { GlobalModalHost } from './global-modal-host';

jest.mock('./modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Modal: ({ children }: { children: React.ReactNode }) => (
      <View testID="bottom-sheet-modal">{children}</View>
    ),
  };
});

describe('globalModalHost', () => {
  beforeEach(() => {
    act(() => {
      useGlobalModalStore.getState().closeAll();
    });
  });

  it('renders nothing when stack is empty', () => {
    render(<GlobalModalHost />);
    expect(screen.queryByTestId('bottom-sheet-modal')).toBeNull();
  });

  it('does not render when top entry is dialog', () => {
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'test-dialog',
          presentation: 'dialog',
          render: () => <>Dialog content</>,
        },
        'replace',
      );
    });

    render(<GlobalModalHost />);
    expect(screen.queryByTestId('bottom-sheet-modal')).toBeNull();
  });

  it('renders sheet content when top entry is sheet', () => {
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'test-sheet',
          presentation: 'sheet',
          render: () => <Text testID="sheet-content">Sheet content</Text>,
        },
        'replace',
      );
    });

    render(<GlobalModalHost />);
    expect(screen.getByTestId('bottom-sheet-modal')).toBeOnTheScreen();
    expect(screen.getByTestId('sheet-content')).toBeOnTheScreen();
  });
});
