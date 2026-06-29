import type { CourierAssignmentDto, LocationDto } from '@/features/courier/types';
import type { CompanyPickup, DeliveryStop } from '@/features/orders/types';

function buildLocationIndex(locations: LocationDto[]): Map<number, LocationDto> {
  return new Map(locations.map(location => [location.id, location]));
}

function buildSyntheticCompany(location: LocationDto): CompanyPickup {
  return {
    id: String(location.id),
    name: location.name,
    address: location.address,
    photoUrl: '',
    items: [{ id: 'default', name: 'Order', quantity: 1 }],
    pickedUpQuantity: 0,
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
    const companyLocation = assignment.company_location != null
      ? locationById.get(assignment.company_location)
      : undefined;

    return {
      id: String(assignment.id),
      name: pickupLocation?.name ?? `Маршрут #${assignment.id}`,
      address: pickupLocation?.address ?? '',
      photoUrl: '',
      isDelivered: false,
      companies: companyLocation ? [buildSyntheticCompany(companyLocation)] : [],
    };
  });
}

/** @deprecated Use mapAssignmentsToStops instead */
export function mapCourierAssignmentToDeliveryStop(
  assignment: CourierAssignmentDto,
): DeliveryStop {
  return mapAssignmentsToStops([assignment], [])[0]!;
}
