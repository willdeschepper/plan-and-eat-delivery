import type { AxiosError } from 'axios';
import type {
  CourierCompleteOrderDto,
  CourierLoginRequest,
  CourierLoginResponse,
} from '@/features/courier/types';
import { useQuery } from '@tanstack/react-query';
import { createMutation } from 'react-query-kit';
import {
  fetchCourierOrders,
  fetchCourierProfile,
  fetchLocations,
} from '@/features/courier/fetchers';
import {
  courierOrdersQueryKey,
  courierProfileQueryKey,
  locationsQueryKey,
} from '@/features/courier/types';
import { client, queryClient } from '@/lib/api';
import { useAuthStore } from '@/lib/hooks';

export type {
  CourierAssignmentDto,
  CourierCompleteOrderDto,
  CourierLoginRequest,
  CourierLoginResponse,
  CourierProfileDto,
  CourierTokenDto,
  LocationDto,
} from '@/features/courier/types';

export {
  courierOrdersQueryKey,
  courierProfileQueryKey,
  locationsQueryKey,
} from '@/features/courier/types';

export function useCourierOrders() {
  const status = useAuthStore.use.status();

  return useQuery({
    queryKey: courierOrdersQueryKey,
    enabled: status === 'signIn',
    queryFn: fetchCourierOrders,
  });
}

export function useLocations() {
  const status = useAuthStore.use.status();

  return useQuery({
    queryKey: locationsQueryKey,
    enabled: status === 'signIn',
    queryFn: fetchLocations,
  });
}

export function useCourierProfile() {
  const status = useAuthStore.use.status();

  return useQuery({
    queryKey: courierProfileQueryKey,
    enabled: status === 'signIn',
    queryFn: fetchCourierProfile,
  });
}

export const useCourierLogin = createMutation<
  CourierLoginResponse,
  CourierLoginRequest,
  AxiosError
>({
  mutationFn: async variables =>
    client
      .post('/api/couriers/login/', variables)
      .then(response => response.data),
});

export const useCompleteAssignment = createMutation<
  CourierCompleteOrderDto,
  { id: number },
  AxiosError
>({
  mutationFn: async variables =>
    client
      .put(`/api/couriers/${variables.id}/complete/`)
      .then(response => response.data),
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: courierOrdersQueryKey });
  },
});
