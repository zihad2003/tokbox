export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  customization?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
  isManual?: boolean;
}

export interface SystemConfig {
  id: string;
  isOrdersFrozen: boolean;
  freezeMessage?: string;
}
