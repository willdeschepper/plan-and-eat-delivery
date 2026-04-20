export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface CompanyPickup {
  id: string;
  name: string;
  photoUrl: string;
  address: string;
  items: DeliveryItem[];
  pickedUpQuantity: number;
}

export interface DeliveryStop {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
  companies: CompanyPickup[];
  isDelivered: boolean;
}

export interface CourierProfile {
  id: string;
  name: string;
  avatarUrl: string;
  completedOrdersToday: number;
  totalEarnings: number;
}
