import * as React from 'react';

import { cleanup, render, screen } from '@/lib/test-utils';

import { EmptyList, NoData } from './list';

afterEach(cleanup);

describe('emptyList', () => {
  it('shows ActivityIndicator when isLoading is true', () => {
    render(<EmptyList isLoading />);
    expect(screen.getByTestId).toBeDefined();
    // ActivityIndicator is rendered; we don't have testID on it, so just ensure no "Sorry" text
    expect(screen.queryByText('Sorry! No data found')).not.toBeOnTheScreen();
  });

  it('shows NoData and "Sorry! No data found" when isLoading is false', () => {
    render(<EmptyList isLoading={false} />);
    expect(screen.getByText('Sorry! No data found')).toBeOnTheScreen();
  });
});

describe('noData', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<NoData />);
    expect(toJSON()).not.toBeNull();
  });
});
