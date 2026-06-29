import type { CourierAssignmentDto, LocationDto } from '@/features/courier/types';

import { mapAssignmentsToStops } from './mappers';

const pickupLocation: LocationDto = {
  id: 10,
  name: 'Pickup Hub',
  address: '123 Pickup St',
  longitude: '49.8',
  latitude: '40.4',
  phone: '+994501234567',
  start_hour: '09:00:00',
  end_hour: '18:00:00',
};

const companyLocation: LocationDto = {
  id: 20,
  name: 'Office A',
  address: '456 Company Ave',
  longitude: '49.9',
  latitude: '40.5',
  phone: '+994507654321',
  start_hour: '10:00:00',
  end_hour: '19:00:00',
};

describe('mapAssignmentsToStops', () => {
  it('maps assignment with both location ids to stop with address and company', () => {
    const assignments: CourierAssignmentDto[] = [
      { id: 1, company_location: 20, pickup_location: 10 },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation, companyLocation]);

    expect(stops).toHaveLength(1);
    expect(stops[0]).toMatchObject({
      id: '1',
      name: 'Pickup Hub',
      address: '123 Pickup St',
      companies: [
        expect.objectContaining({
          id: '20',
          name: 'Office A',
          address: '456 Company Ave',
          items: [{ id: 'default', name: 'Order', quantity: 1 }],
        }),
      ],
    });
  });

  it('maps assignment with only pickup_location to address without companies', () => {
    const assignments: CourierAssignmentDto[] = [
      { id: 2, company_location: null, pickup_location: 10 },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation]);

    expect(stops[0]).toMatchObject({
      id: '2',
      name: 'Pickup Hub',
      address: '123 Pickup St',
      companies: [],
    });
  });

  it('falls back gracefully when location id is unknown', () => {
    const assignments: CourierAssignmentDto[] = [
      { id: 3, company_location: 99, pickup_location: 88 },
    ];

    const stops = mapAssignmentsToStops(assignments, []);

    expect(stops[0]).toMatchObject({
      id: '3',
      name: 'Маршрут #3',
      address: '',
      companies: [],
    });
  });

  it('maps multiple assignments', () => {
    const assignments: CourierAssignmentDto[] = [
      { id: 1, company_location: 20, pickup_location: 10 },
      { id: 2, company_location: null, pickup_location: 10 },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation, companyLocation]);

    expect(stops).toHaveLength(2);
    expect(stops[0]?.companies).toHaveLength(1);
    expect(stops[1]?.companies).toHaveLength(0);
  });
});
