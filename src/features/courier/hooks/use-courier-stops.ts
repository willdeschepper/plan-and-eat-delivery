import * as React from 'react';

import { useCourierOrders, useLocations } from '@/features/courier/api';
import { mapAssignmentsToStops } from '@/features/courier/mappers';

export function useCourierStops() {
  const ordersQuery = useCourierOrders();
  const locationsQuery = useLocations();

  const stops = React.useMemo(
    () => mapAssignmentsToStops(ordersQuery.data ?? [], locationsQuery.data ?? []),
    [ordersQuery.data, locationsQuery.data],
  );

  return {
    stops,
    isLoading: ordersQuery.isLoading || locationsQuery.isLoading,
    isError: ordersQuery.isError || locationsQuery.isError,
    refetch: () => Promise.all([ordersQuery.refetch(), locationsQuery.refetch()]),
    isRefetching: ordersQuery.isRefetching || locationsQuery.isRefetching,
  };
}
