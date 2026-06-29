import * as React from 'react';

import { USE_COURIER_API_ORDERS } from '@/features/courier/config';
import { useCourierOrders, useLocations } from '@/features/courier/api';
import { mapAssignmentsToStops } from '@/features/courier/mappers';
import { MOCK_STOPS } from '@/features/orders/mock-data';

export function useCourierStops() {
  const ordersQuery = useCourierOrders();
  const locationsQuery = useLocations();

  const apiStops = React.useMemo(
    () => mapAssignmentsToStops(ordersQuery.data ?? [], locationsQuery.data ?? []),
    [ordersQuery.data, locationsQuery.data],
  );

  if (!USE_COURIER_API_ORDERS) {
    return {
      stops: MOCK_STOPS,
      isLoading: false,
      isError: false,
      refetch: () => Promise.resolve([]),
      isRefetching: false,
    };
  }

  return {
    stops: apiStops,
    isLoading: ordersQuery.isLoading || locationsQuery.isLoading,
    isError: ordersQuery.isError || locationsQuery.isError,
    refetch: () => Promise.all([ordersQuery.refetch(), locationsQuery.refetch()]),
    isRefetching: ordersQuery.isRefetching || locationsQuery.isRefetching,
  };
}
