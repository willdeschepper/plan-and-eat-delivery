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
    name: 'Noodle Kitchen',
    address: '14 Abdullayev St, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    orders: [
      {
        id: 'order-1-1',
        customerName: 'Alisher Karimov',
        isPickedUp: false,
        items: [
          { id: 'item-1', name: 'Beef Pho', quantity: 1 },
          { id: 'item-2', name: 'Spring Rolls', quantity: 2 },
        ],
      },
      {
        id: 'order-1-2',
        customerName: 'Dilnoza Yusupova',
        isPickedUp: false,
        items: [
          { id: 'item-3', name: 'Chicken Ramen', quantity: 1 },
          { id: 'item-4', name: 'Miso Soup', quantity: 1 },
        ],
      },
      {
        id: 'order-1-3',
        customerName: 'Sardor Toshmatov',
        isPickedUp: false,
        items: [
          { id: 'item-5', name: 'Pad Thai', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'stop-2',
    name: 'Pizza House',
    address: '22 Navoi Ave, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    orders: [
      {
        id: 'order-2-1',
        customerName: 'Malika Ergasheva',
        isPickedUp: false,
        items: [
          { id: 'item-6', name: 'Margherita Pizza', quantity: 1 },
          { id: 'item-7', name: 'Caesar Salad', quantity: 1 },
        ],
      },
      {
        id: 'order-2-2',
        customerName: 'Jasur Umarov',
        isPickedUp: false,
        items: [
          { id: 'item-8', name: 'BBQ Chicken Pizza', quantity: 2 },
          { id: 'item-9', name: 'Garlic Bread', quantity: 3 },
        ],
      },
    ],
  },
  {
    id: 'stop-3',
    name: 'Burger Spot',
    address: '5 Chilanzar St, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
    orders: [
      {
        id: 'order-3-1',
        customerName: 'Nodira Hasanova',
        isPickedUp: false,
        items: [
          { id: 'item-10', name: 'Double Smash Burger', quantity: 1 },
          { id: 'item-11', name: 'Fries Large', quantity: 1 },
          { id: 'item-12', name: 'Cola', quantity: 2 },
        ],
      },
      {
        id: 'order-3-2',
        customerName: 'Bobur Nazarov',
        isPickedUp: false,
        items: [
          { id: 'item-13', name: 'Crispy Chicken Burger', quantity: 1 },
          { id: 'item-14', name: 'Onion Rings', quantity: 1 },
        ],
      },
      {
        id: 'order-3-3',
        customerName: 'Zulfiya Rakhimova',
        isPickedUp: false,
        items: [
          { id: 'item-15', name: 'Veggie Burger', quantity: 1 },
          { id: 'item-16', name: 'Lemonade', quantity: 1 },
        ],
      },
      {
        id: 'order-3-4',
        customerName: 'Firdavs Mirzayev',
        isPickedUp: false,
        items: [
          { id: 'item-17', name: 'Bacon Cheese Burger', quantity: 2 },
          { id: 'item-18', name: 'Fries Medium', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'stop-4',
    name: 'Sushi Garden',
    address: '8 Yunusabad Blvd, Tashkent',
    photoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
    orders: [
      {
        id: 'order-4-1',
        customerName: 'Shahlo Tursunova',
        isPickedUp: false,
        items: [
          { id: 'item-19', name: 'Salmon Roll × 8pcs', quantity: 2 },
          { id: 'item-20', name: 'Miso Soup', quantity: 1 },
        ],
      },
      {
        id: 'order-4-2',
        customerName: 'Akbar Yuldashev',
        isPickedUp: false,
        items: [
          { id: 'item-21', name: 'Dragon Roll × 8pcs', quantity: 1 },
          { id: 'item-22', name: 'Edamame', quantity: 1 },
          { id: 'item-23', name: 'Green Tea', quantity: 2 },
        ],
      },
    ],
  },
];
