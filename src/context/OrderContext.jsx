import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('tokbox_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tokbox_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerInfo) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (parseFloat(item.price.replace(' tk', '')) * item.quantity), 0),
      customer: customerInfo,
      status: 'pending',
      date: new Date().toISOString(),
      type: 'online'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder.id;
  };

  const addManualSale = (items, customerInfo) => {
    const newOrder = {
      id: `SALE-${Date.now()}`,
      items: items,
      total: items.reduce((acc, item) => acc + (parseFloat(item.price.replace(' tk', '')) * item.quantity), 0),
      customer: customerInfo,
      status: 'completed',
      date: new Date().toISOString(),
      type: 'manual'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider value={{ 
      cart, 
      orders, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      placeOrder, 
      addManualSale,
      updateOrderStatus,
      deleteOrder,
      clearAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};
