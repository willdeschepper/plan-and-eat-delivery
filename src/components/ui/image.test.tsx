import * as React from 'react';

import { cleanup, render, screen } from '@/lib/test-utils';

import { Image, preloadImages } from './image';

jest.mock('expo-image', () => {
  const RN = require('react-native');
  const mockPrefetch = jest.fn();
  const ImageComponent = ({ testID, ...props }: { testID?: string }) => (
    <RN.View testID={testID} {...props} />
  );
  // NImage.prefetch(sources) in image.tsx
  (ImageComponent as unknown as { prefetch: jest.Mock }).prefetch = mockPrefetch;
  return {
    Image: ImageComponent,
    __getPrefetchMock: () => mockPrefetch,
  };
});

function getPrefetchMock() {
  return (jest.requireMock('expo-image') as { __getPrefetchMock: () => jest.Mock })
    .__getPrefetchMock();
}

beforeEach(() => getPrefetchMock().mockClear());
afterEach(cleanup);

describe('image', () => {
  it('renders with source and testID', () => {
    render(
      <Image testID="img" source={{ uri: 'https://example.com/img.png' }} />,
    );
    expect(screen.getByTestId('img')).toBeOnTheScreen();
  });

  it('uses default placeholder when not provided', () => {
    render(
      <Image testID="img2" source={{ uri: 'https://example.com/a.png' }} />,
    );
    expect(screen.getByTestId('img2')).toBeOnTheScreen();
  });
});

describe('preloadImages', () => {
  it('calls NImage.prefetch with the same sources array', () => {
    const prefetchMock = getPrefetchMock();
    const sources = ['https://a.com/1.png', 'https://a.com/2.png'];
    preloadImages(sources);
    expect(prefetchMock).toHaveBeenCalledTimes(1);
    expect(prefetchMock).toHaveBeenCalledWith(sources);
  });
});
