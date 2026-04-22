import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatPrice } from '../lib/utils';

export default function Cart({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, placeOrder, systemConfig } = useOrders();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || systemConfig.isOrdersFrozen) return;
    
    const orderId = await placeOrder(customer.name, customer.phone);
    if (orderId) {
      setCustomer({ name: '', phone: '', address: '' });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with glassmorphism */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]"
          />

          {/* Sidebar with Glassmorphism */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1b1f13]/80 backdrop-blur-2xl border-l border-[var(--color-gold)]/20 z-[1001] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[var(--color-gold)]" />
                <h2 className="text-2xl font-heading font-bold">Your Order</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {systemConfig.isOrdersFrozen && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                  <p className="text-red-400 text-sm font-bold uppercase tracking-widest">
                    ❄️ {systemConfig.freezeMessage}
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="italic">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={`${item.id}-${item.customization}`} 
                        className="glass p-4 rounded-2xl flex gap-4 items-center group"
                      >
                        <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-[var(--color-gold)] font-bold text-xs">{formatPrice(item.price)}</p>
                          {item.customization && (
                            <p className="text-[10px] opacity-40 mt-1 italic">"{item.customization}"</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 glass px-2 py-1 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-[var(--color-gold)] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-[var(--color-gold)] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4 pt-8 border-t border-white/5">
                    <h4 className="text-sm uppercase tracking-widest opacity-50 mb-4">Delivery Details</h4>
                    <div className="space-y-3">
                      <input 
                        required
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--color-gold)] outline-none transition-colors"
                        value={customer.name}
                        onChange={e => setCustomer({...customer, name: e.target.value})}
                      />
                      <input 
                        required
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--color-gold)] outline-none transition-colors"
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                      />
                      <textarea 
                        required
                        placeholder="Delivery Address"
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--color-gold)] outline-none transition-colors resize-none"
                        value={customer.address}
                        onChange={e => setCustomer({...customer, address: e.target.value})}
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 space-y-6 bg-black/20">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="opacity-60 text-sm uppercase tracking-widest">Grand Total</span>
                  <span className="text-[var(--color-gold)] text-3xl font-heading">{formatPrice(total)}</span>
                </div>
                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={systemConfig.isOrdersFrozen}
                  className="w-full bg-[var(--color-gold)] text-[var(--color-olive)] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Confirm Order
                  <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
