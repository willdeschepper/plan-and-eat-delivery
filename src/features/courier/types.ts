export type CourierLoginRequest = {
  email: string;
  password: string;
  device_token: string;
};

export type CourierTokenDto = {
  access: string;
  refresh: string;
};

export type CourierLoginResponse = {
  token: CourierTokenDto;
};

export type CourierAssignmentDto = {
  id: number;
  company_location: number | null;
  pickup_location: number | null;
};

export type CourierCompleteOrderDto = {
  id: number;
};

export type LocationDto = {
  id: number;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  phone: string;
  start_hour: string;
  end_hour: string;
};

export type CourierProfileDto = {
  name: string;
  surname: string;
  email: string;
  mobile: string;
};

export const courierOrdersQueryKey = ['courier', 'orders'] as const;
export const locationsQueryKey = ['locations'] as const;
export const courierProfileQueryKey = ['courier', 'profile'] as const;
