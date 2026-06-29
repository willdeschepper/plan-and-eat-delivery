import type { CourierProfileDto } from '@/features/courier/types';

import type { CourierProfile, DeliveryStop } from './types';

export const MOCK_PROFILE: CourierProfile = {
  id: 'courier-1',
  name: 'Əli Hüseynov',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  completedOrdersToday: 2,
  totalEarnings: 17.0,
};

export const MOCK_COURIER_PROFILE_DTO: CourierProfileDto = {
  name: 'Əli',
  surname: 'Hüseynov',
  email: 'ali.huseynov@courier.az',
  mobile: '+994 50 312 78 90',
};

export const MOCK_STOPS: DeliveryStop[] = [
  {
    id: 'stop-1',
    name: 'Çinar Restaurant',
    address: 'Neftçilər pr. 18, Bakı',
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'co-1-1',
        name: 'Çinar Kitchen',
        address: 'Neftçilər pr. 18, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-1', name: 'Plov (Plovla toyuq)', quantity: 2 },
          { id: 'item-2', name: 'Dövşanbaz şorbası', quantity: 1 },
          { id: 'item-3', name: 'Qutab (pendir)', quantity: 4 },
        ],
      },
      {
        id: 'co-1-2',
        name: 'Çinar Bakery',
        address: 'Neftçilər pr. 18/A, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-4', name: 'Badambura', quantity: 6 },
          { id: 'item-5', name: 'Şəkərbura', quantity: 6 },
        ],
      },
    ],
  },
  {
    id: 'stop-2',
    name: 'Metro Pizza Bakı',
    address: 'İstiqlaliyyət küç. 5, Bakı',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'co-2-1',
        name: 'Metro Pizza',
        address: 'İstiqlaliyyət küç. 5, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-6', name: 'Margarita Pizza (L)', quantity: 1 },
          { id: 'item-7', name: 'Pepperoni Pizza (L)', quantity: 2 },
          { id: 'item-8', name: 'Coke 0.5L', quantity: 3 },
        ],
      },
    ],
  },
  {
    id: 'stop-3',
    name: 'Sushi Master',
    address: 'Hüsü Hacıyev küç. 33, Bakı',
    photoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'co-3-1',
        name: 'Sushi Master',
        address: 'Hüsü Hacıyev küç. 33, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-9', name: 'Philadelphia Roll (8 pcs)', quantity: 2 },
          { id: 'item-10', name: 'Dragon Roll (8 pcs)', quantity: 1 },
          { id: 'item-11', name: 'Miso Soup', quantity: 2 },
          { id: 'item-12', name: 'Edamame', quantity: 1 },
        ],
      },
      {
        id: 'co-3-2',
        name: 'Wok Kitchen',
        address: 'Hüsü Hacıyev küç. 35, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-13', name: 'Pad Thai (chicken)', quantity: 1 },
          { id: 'item-14', name: 'Spring Rolls (4 pcs)', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'stop-4',
    name: 'Burger House',
    address: 'Nizami küç. 72, Bakı',
    photoUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'co-4-1',
        name: 'Burger House',
        address: 'Nizami küç. 72, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-15', name: 'Classic Burger', quantity: 3 },
          { id: 'item-16', name: 'Crispy Chicken Burger', quantity: 2 },
          { id: 'item-17', name: 'French Fries (L)', quantity: 4 },
          { id: 'item-18', name: 'Onion Rings', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'stop-5',
    name: 'Green Café',
    address: 'Rəşid Behbudov küç. 14, Bakı',
    photoUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
    isDelivered: false,
    companies: [
      {
        id: 'co-5-1',
        name: 'Green Café',
        address: 'Rəşid Behbudov küç. 14, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-19', name: 'Ceasar Salad', quantity: 2 },
          { id: 'item-20', name: 'Quinoa Bowl', quantity: 1 },
          { id: 'item-21', name: 'Avocado Toast', quantity: 3 },
        ],
      },
      {
        id: 'co-5-2',
        name: 'Juice Bar',
        address: 'Rəşid Behbudov küç. 14/B, Bakı',
        photoUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80',
        pickedUpQuantity: 0,
        items: [
          { id: 'item-22', name: 'Freshly Squeezed Orange Juice', quantity: 4 },
          { id: 'item-23', name: 'Green Smoothie', quantity: 2 },
        ],
      },
    ],
  },
];
