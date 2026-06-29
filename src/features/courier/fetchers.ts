import type {
  CourierAssignmentDto,
  CourierProfileDto,
  LocationDto,
} from '@/features/courier/types';
import { client } from '@/lib/api';

export async function fetchCourierOrders(): Promise<CourierAssignmentDto[]> {
  const response = await client.get<CourierAssignmentDto[]>('/api/couriers/orders/');
  return response.data;
}

export async function fetchLocations(): Promise<LocationDto[]> {
  const response = await client.get<LocationDto[]>('/api/locations/');
  return response.data;
}

export async function fetchCourierProfile(): Promise<CourierProfileDto> {
  const response = await client.get<CourierProfileDto>('/api/couriers/profile/');
  return response.data;
}
