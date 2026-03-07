export type DeliveryStatus = 'pending' | 'accepted' | 'collected' | 'delivered';

export interface Delivery {
  id: string;
  restaurantName: string;
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  value: number;
  fee: number;
  status: DeliveryStatus;
  createdAt: string;
  motoboyName?: string;
  distance: string;
  estimatedTime: string;
  items: string;
}

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    restaurantName: 'Pizzaria Bella Napoli',
    pickupAddress: 'Rua das Flores, 123 - Centro',
    deliveryAddress: 'Av. Brasil, 456 - Jardim América',
    customerName: 'João Silva',
    value: 89.90,
    fee: 8.50,
    status: 'pending',
    createdAt: '2026-03-07T14:30:00',
    distance: '3.2 km',
    estimatedTime: '15 min',
    items: '2x Pizza Margherita, 1x Coca-Cola 2L',
  },
  {
    id: '2',
    restaurantName: 'Sushi Tanaka',
    pickupAddress: 'Rua Japão, 789 - Liberdade',
    deliveryAddress: 'Rua Augusta, 1010 - Consolação',
    customerName: 'Maria Santos',
    value: 156.00,
    fee: 12.00,
    status: 'accepted',
    createdAt: '2026-03-07T14:15:00',
    motoboyName: 'Carlos Oliveira',
    distance: '5.1 km',
    estimatedTime: '22 min',
    items: '1x Combo Sashimi, 1x Temaki Salmão',
  },
  {
    id: '3',
    restaurantName: 'Burger House',
    pickupAddress: 'Av. Paulista, 2000 - Bela Vista',
    deliveryAddress: 'Rua Oscar Freire, 300 - Pinheiros',
    customerName: 'Pedro Costa',
    value: 67.50,
    fee: 7.00,
    status: 'collected',
    createdAt: '2026-03-07T13:50:00',
    motoboyName: 'Carlos Oliveira',
    distance: '2.8 km',
    estimatedTime: '12 min',
    items: '2x Smash Burger, 1x Batata Frita G',
  },
  {
    id: '4',
    restaurantName: 'Açaí da Praia',
    pickupAddress: 'Rua do Sol, 55 - Vila Madalena',
    deliveryAddress: 'Rua Harmonia, 120 - Vila Madalena',
    customerName: 'Ana Lima',
    value: 42.00,
    fee: 5.50,
    status: 'delivered',
    createdAt: '2026-03-07T12:30:00',
    motoboyName: 'Rafael Mendes',
    distance: '1.5 km',
    estimatedTime: '8 min',
    items: '1x Açaí 700ml, 1x Suco Verde',
  },
  {
    id: '5',
    restaurantName: 'Cantina do Luigi',
    pickupAddress: 'Rua Itália, 88 - Mooca',
    deliveryAddress: 'Av. Celso Garcia, 500 - Belém',
    customerName: 'Fernando Alves',
    value: 112.00,
    fee: 9.00,
    status: 'pending',
    createdAt: '2026-03-07T14:45:00',
    distance: '4.0 km',
    estimatedTime: '18 min',
    items: '1x Lasanha Bolonhesa, 1x Tiramisu',
  },
];

export const mockStats = {
  restaurant: {
    totalDeliveries: 47,
    activeDeliveries: 3,
    todayRevenue: 1289.50,
    avgDeliveryTime: '18 min',
  },
  motoboy: {
    totalDeliveries: 23,
    todayEarnings: 187.50,
    rating: 4.8,
    onlineHours: '6h 30min',
  },
};
