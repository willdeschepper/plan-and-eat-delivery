import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { useGlobalModalStore } from '@/lib/hooks/use-global-modal-store';
import { GlobalDialogHost } from './global-dialog-host';

describe('globalDialogHost', () => {
  beforeEach(() => {
    act(() => {
      useGlobalModalStore.getState().closeAll();
    });
  });

  it('renders nothing when stack is empty', () => {
    render(<GlobalDialogHost />);
    expect(screen.queryByLabelText('Close modal')).toBeNull();
  });

  it('renders dialog content when top entry is dialog', () => {
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'test-dialog',
          presentation: 'dialog',
          render: () => <Text testID="dialog-content">Dialog content</Text>,
        },
        'replace',
      );
    });

    render(<GlobalDialogHost />);
    expect(screen.getByTestId('dialog-content')).toBeOnTheScreen();
  });

  it('does not render when top entry is sheet', () => {
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'test-sheet',
          presentation: 'sheet',
          render: () => <Text>Sheet content</Text>,
        },
        'replace',
      );
    });

    render(<GlobalDialogHost />);
    expect(screen.queryByText('Sheet content')).toBeNull();
  });

  it('renders dialog when stacked with sheet (dialog on top)', () => {
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'sheet',
          presentation: 'sheet',
          render: () => <Text>Sheet</Text>,
        },
        'replace',
      );
    });
    act(() => {
      useGlobalModalStore.getState().open(
        {
          id: 'dialog',
          presentation: 'dialog',
          render: () => <Text testID="stacked-dialog">Dialog</Text>,
        },
        'stack',
      );
    });

    render(<GlobalDialogHost />);
    expect(screen.getByTestId('stacked-dialog')).toBeOnTheScreen();
    expect(screen.queryByText('Sheet')).toBeNull();
  });
});
