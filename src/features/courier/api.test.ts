import {
  courierOrdersQueryKey,
  courierProfileQueryKey,
  locationsQueryKey,
} from '@/features/courier/types';
import {
  fetchCourierOrders,
  fetchCourierProfile,
  fetchLocations,
} from './fetchers';

let clientGetMock: jest.Mock;

jest.mock('@/lib/api', () => {
  const get = jest.fn();
  clientGetMock = get;
  return {
    client: { get, post: jest.fn(), put: jest.fn() },
  };
});

describe('features/courier fetchers', () => {
  beforeEach(() => {
    clientGetMock.mockReset();
    clientGetMock.mockResolvedValue({ data: [] });
  });

  it('fetchCourierOrders gets courier orders', async () => {
    const orders = [{ id: 1, company_location: 2, pickup_location: 3 }];
    clientGetMock.mockResolvedValueOnce({ data: orders });

    const result = await fetchCourierOrders();

    expect(clientGetMock).toHaveBeenCalledWith('/api/couriers/orders/');
    expect(result).toEqual(orders);
    expect(courierOrdersQueryKey).toEqual(['courier', 'orders']);
  });

  it('fetchLocations gets locations list', async () => {
    const locations = [{ id: 1, name: 'Hub', address: 'Addr' }];
    clientGetMock.mockResolvedValueOnce({ data: locations });

    const result = await fetchLocations();

    expect(clientGetMock).toHaveBeenCalledWith('/api/locations/');
    expect(result).toEqual(locations);
    expect(locationsQueryKey).toEqual(['locations']);
  });

  it('fetchCourierProfile gets courier profile', async () => {
    const profile = {
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      mobile: '+994501234567',
    };
    clientGetMock.mockResolvedValueOnce({ data: profile });

    const result = await fetchCourierProfile();

    expect(clientGetMock).toHaveBeenCalledWith('/api/couriers/profile/');
    expect(result).toEqual(profile);
    expect(courierProfileQueryKey).toEqual(['courier', 'profile']);
  });
});
