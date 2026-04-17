export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  items: OrderItem[];
  isPickedUp: boolean;
}

export interface DeliveryStop {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
  orders: CustomerOrder[];
}

export interface CourierProfile {
  id: string;
  name: string;
  avatarUrl: string;
  completedOrdersToday: number;
  totalEarnings: number;
}
