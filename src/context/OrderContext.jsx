import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tokbox_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tokbox_orders');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [systemConfig, setSystemConfig] = useState({
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

  const addToCart = (product, customization = null) => {
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
    toast.success(`${product.name || product.title} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    toast.error('Item removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerName, customerPhone) => {
    if (systemConfig.isOrdersFrozen) {
      toast.error('Cannot place order: Orders are frozen.');
      return null;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    const totalAmount = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerName,
      customerPhone,
      items: [...cart],
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success('Order placed successfully!', {
      duration: 5000,
      icon: '🔥',
    });
    return newOrder.id;
  };

  const addManualSale = (items, customerInfo) => {
    const newOrder = {
      id: `SALE-${Date.now()}`,
      items: items,
      totalAmount: items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0),
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      status: 'completed',
      createdAt: new Date().toISOString(),
      isManual: true
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order status updated to ${status}`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
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
      addManualSale,
      updateOrderStatus,
      deleteOrder,
      clearAllOrders,
      toggleFreezeOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};
