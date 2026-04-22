import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, Product, SystemConfig } from '../types';
import toast from 'react-hot-toast';

interface OrderContextType {
  cart: CartItem[];
  orders: Order[];
  systemConfig: SystemConfig;
  addToCart: (product: Product, customization?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleFreezeOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tokbox_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tokbox_orders');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    id: 'main',
    isOrdersFrozen: false,
    freezeMessage: 'We are currently not accepting orders due to a holiday.'
  });

  useEffect(() => {
    localStorage.setItem('tokbox_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tokbox_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, customization?: string) => {
    if (systemConfig.isOrdersFrozen) {
      toast.error(systemConfig.freezeMessage || 'Orders are currently frozen.');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.customization === customization);
      if (existing) {
        return prev.map(i => 
          (i.id === product.id && i.customization === customization) 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...product, quantity: 1, customization }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    toast.error('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerName: string, customerPhone: string) => {
    if (systemConfig.isOrdersFrozen) {
      toast.error('Cannot place order: Orders are frozen.');
      return null;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName,
      customerPhone,
      items: [...cart],
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // In a real app, this would be an API call
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success('Order placed successfully!', {
      duration: 5000,
      icon: '🔥',
    });
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order status updated to ${status}`);
  };

  const toggleFreezeOrders = () => {
    setSystemConfig(prev => ({ ...prev, isOrdersFrozen: !prev.isOrdersFrozen }));
    toast(systemConfig.isOrdersFrozen ? 'Orders are now unfrozen' : 'Orders are now frozen', {
      icon: '❄️',
    });
  };

  return (
    <OrderContext.Provider value={{ 
      cart, 
      orders, 
      systemConfig,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      placeOrder, 
      updateOrderStatus,
      toggleFreezeOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};
