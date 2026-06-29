import * as React from 'react';

import { requestAppStoreReview } from '../lib/request-app-store-review';

export function useRateAppScreenController() {
  const [rating, setRating] = React.useState(0);

  const handleSelectRating = React.useCallback((value: number) => {
    setRating(value);
    void requestAppStoreReview();
  }, []);

  return {
    rating,
    handleSelectRating,
  };
}
