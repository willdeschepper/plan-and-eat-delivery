import type {
  CourierAssignmentDto,
  LocationDto,
  MealOrderDto,
} from '@/features/courier/types';
import type { CompanyPickup, DeliveryStop } from '@/features/orders/types';

function buildLocationIndex(locations: LocationDto[]): Map<number, LocationDto> {
  return new Map(locations.map(location => [location.id, location]));
}

function buildCompanyFromOrders(
  companyLocationId: number,
  orders: MealOrderDto[],
  locationById: Map<number, LocationDto>,
): CompanyPickup {
  const location = locationById.get(companyLocationId);
  const address = orders[0]?.company_location?.address ?? location?.address ?? '';

  return {
    id: String(companyLocationId),
    name: address,
    address,
    photoUrl: '',
    items: orders.map(order => ({
      id: String(order.id),
      name: order.meal.name,
      quantity: 1,
    })),
    pickedUpQuantity: orders.filter(o => o.is_delivered).length,
  };
}

export function mapAssignmentsToStops(
  assignments: CourierAssignmentDto[],
  locations: LocationDto[],
): DeliveryStop[] {
  const locationById = buildLocationIndex(locations);

  return assignments.map((assignment) => {
    const pickupLocation = assignment.pickup_location != null
      ? locationById.get(assignment.pickup_location)
      : undefined;

    const ordersByCompany = new Map<number, MealOrderDto[]>();
    for (const order of assignment.orders) {
      if (order.company_location == null)
        continue;
      const list = ordersByCompany.get(order.company_location.id) ?? [];
      list.push(order);
      ordersByCompany.set(order.company_location.id, list);
    }

    const companies = [...ordersByCompany.entries()].map(([id, orders]) =>
      buildCompanyFromOrders(id, orders, locationById));

    return {
      id: String(assignment.id),
      name: pickupLocation?.name ?? `Маршрут #${assignment.id}`,
      address: pickupLocation?.address ?? '',
      photoUrl: '',
      isDelivered: assignment.orders.length > 0
        && assignment.orders.every(o => o.is_delivered),
      companies,
    };
  });
}

/** @deprecated Use mapAssignmentsToStops instead */
export function mapCourierAssignmentToDeliveryStop(
  assignment: CourierAssignmentDto,
): DeliveryStop {
  return mapAssignmentsToStops([assignment], [])[0]!;
}
