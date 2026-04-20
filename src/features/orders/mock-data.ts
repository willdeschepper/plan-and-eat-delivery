import type { CourierProfile, DeliveryStop } from './types';

export const MOCK_PROFILE: CourierProfile = {
  id: 'courier-1',
  name: 'Ibrohim Karimov',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  completedOrdersToday: 0,
  totalEarnings: 0,
};

export const MOCK_STOPS: DeliveryStop[] = [
  {
    id: 'stop-1',
    name: 'Маршрут #1',
    address: '14 Abdullayev St, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'company-1-1',
        name: 'Noodle Kitchen',
        address: '14 Abdullayev St',
        photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-1', name: 'Beef Pho', quantity: 1 },
          { id: 'item-2', name: 'Spring Rolls', quantity: 2 },
          { id: 'item-3', name: 'Chicken Ramen', quantity: 1 },
        ],
      },
      {
        id: 'company-1-2',
        name: 'Pizza House',
        address: '22 Navoi Ave',
        photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-4', name: 'Margherita Pizza', quantity: 1 },
          { id: 'item-5', name: 'Caesar Salad', quantity: 1 },
        ],
      },
    ],
  },
  {
    id: 'stop-2',
    name: 'Маршрут #2',
    address: '5 Chilanzar St, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'company-2-1',
        name: 'Burger Spot',
        address: '5 Chilanzar St',
        photoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-6', name: 'Double Smash Burger', quantity: 2 },
          { id: 'item-7', name: 'Fries Large', quantity: 2 },
          { id: 'item-8', name: 'Cola', quantity: 3 },
        ],
      },
      {
        id: 'company-2-2',
        name: 'Sushi Garden',
        address: '8 Yunusabad Blvd',
        photoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-9', name: 'Salmon Roll × 8pcs', quantity: 2 },
          { id: 'item-10', name: 'Dragon Roll × 8pcs', quantity: 1 },
          { id: 'item-11', name: 'Miso Soup', quantity: 2 },
        ],
      },
      {
        id: 'company-2-3',
        name: 'Tea Garden',
        address: '3 Mirzo Ulugbek Ave',
        photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-12', name: 'Green Tea Set', quantity: 1 },
          { id: 'item-13', name: 'Bubble Tea', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'stop-3',
    name: 'Маршрут #3',
    address: '8 Yunusabad Blvd, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'company-3-1',
        name: 'Grill House',
        address: '12 Shaykhontohur St',
        photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-14', name: 'Lamb Kebab × 4pcs', quantity: 1 },
          { id: 'item-15', name: 'Chicken Wings', quantity: 2 },
          { id: 'item-16', name: 'Lavash Bread', quantity: 3 },
        ],
      },
    ],
  },
];
