import * as React from 'react';

import type { DeliveryStop } from '../types';
import { useOrdersStore } from '../store/use-orders-store';

export function useStopsWithLocalState(stops: DeliveryStop[]): DeliveryStop[] {
  const pickedUpByCompany = useOrdersStore(s => s.pickedUpByCompany);

  return React.useMemo(
    () =>
      stops.map(stop => ({
        ...stop,
        isDelivered: Boolean(pickedUpByCompany[`delivered:${stop.id}`]),
        companies: stop.companies.map(company => ({
          ...company,
          pickedUpQuantity:
            pickedUpByCompany[`${stop.id}:${company.id}`] ?? company.pickedUpQuantity,
        })),
      })),
    [stops, pickedUpByCompany],
  );
}
