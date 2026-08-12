import type {
  CourierAssignmentDto,
  LocationDto,
  MealOrderDto,
} from '@/features/courier/types';

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

function makeOrder(
  overrides: Partial<MealOrderDto> & { id: number },
): MealOrderDto {
  return {
    meal: { id: overrides.id, name: `Meal ${overrides.id}`, image: '' },
    company_location: {
      id: 20,
      address: '456 Company Ave',
      longitude: '49.9',
      latitude: '40.5',
    },
    pickup_location: 10,
    date: '2026-08-03',
    is_prepared: false,
    is_delivered: false,
    ...overrides,
  };
}

describe('mapAssignmentsToStops', () => {
  it('maps multiple orders on one company_location into one company with items', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 1,
        company_location: 20,
        pickup_location: 10,
        orders: [
          makeOrder({ id: 64, meal: { id: 1, name: 'Sobada et', image: '' } }),
          makeOrder({ id: 65, meal: { id: 2, name: 'Blinchik', image: '' } }),
          makeOrder({ id: 66, meal: { id: 3, name: 'Onigiri', image: '' } }),
          makeOrder({ id: 67, meal: { id: 4, name: 'Brunch Krep', image: '' } }),
        ],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation, companyLocation]);

    expect(stops).toHaveLength(1);
    expect(stops[0]).toMatchObject({
      id: '1',
      name: 'Pickup Hub',
      address: '123 Pickup St',
      isDelivered: false,
      companies: [
        expect.objectContaining({
          id: '20',
          name: '456 Company Ave',
          address: '456 Company Ave',
          pickedUpQuantity: 0,
          items: [
            { id: '64', name: 'Sobada et', quantity: 1 },
            { id: '65', name: 'Blinchik', quantity: 1 },
            { id: '66', name: 'Onigiri', quantity: 1 },
            { id: '67', name: 'Brunch Krep', quantity: 1 },
          ],
        }),
      ],
    });
  });

  it('maps assignment with empty orders to address without companies', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 2,
        company_location: null,
        pickup_location: 10,
        orders: [],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation]);

    expect(stops[0]).toMatchObject({
      id: '2',
      name: 'Pickup Hub',
      address: '123 Pickup St',
      companies: [],
      isDelivered: false,
    });
  });

  it('falls back gracefully when pickup_location is unknown and orders have no company', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 3,
        company_location: 99,
        pickup_location: 88,
        orders: [
          makeOrder({
            id: 10,
            company_location: null,
          }),
        ],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, []);

    expect(stops[0]).toMatchObject({
      id: '3',
      name: 'Маршрут #3',
      address: '',
      companies: [],
    });
  });

  it('marks stop as delivered when all orders are delivered', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 4,
        company_location: 20,
        pickup_location: 10,
        orders: [
          makeOrder({ id: 1, is_delivered: true }),
          makeOrder({ id: 2, is_delivered: true }),
        ],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation, companyLocation]);

    expect(stops[0]?.isDelivered).toBe(true);
    expect(stops[0]?.companies[0]?.pickedUpQuantity).toBe(2);
  });

  it('uses company address from order as company name', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 5,
        company_location: 20,
        pickup_location: null,
        orders: [
          makeOrder({
            id: 1,
            meal: { id: 1, name: 'Combo', image: '' },
            company_location: {
              id: 20,
              address: 'Bayil Bay',
              longitude: '40.3',
              latitude: '49.8',
            },
          }),
        ],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, []);

    expect(stops[0]).toMatchObject({
      id: '5',
      name: 'Маршрут #5',
      companies: [
        expect.objectContaining({
          id: '20',
          name: 'Bayil Bay',
          address: 'Bayil Bay',
          items: [{ id: '1', name: 'Combo', quantity: 1 }],
        }),
      ],
    });
  });

  it('maps multiple assignments', () => {
    const assignments: CourierAssignmentDto[] = [
      {
        id: 1,
        company_location: 20,
        pickup_location: 10,
        orders: [makeOrder({ id: 1 })],
      },
      {
        id: 2,
        company_location: null,
        pickup_location: 10,
        orders: [],
      },
    ];

    const stops = mapAssignmentsToStops(assignments, [pickupLocation, companyLocation]);

    expect(stops).toHaveLength(2);
    expect(stops[0]?.companies).toHaveLength(1);
    expect(stops[1]?.companies).toHaveLength(0);
  });
});
