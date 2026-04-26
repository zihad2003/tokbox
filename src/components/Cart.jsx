import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../lib/utils';

export default function Cart({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, placeOrder, systemConfig } = useOrders();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C3322]/35 backdrop-blur-md z-[1000]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-olive)]/95 backdrop-blur-2xl border-l border-[var(--color-sage)]/30 z-[1001] shadow-[-8px_0_40px_rgba(82,104,45,0.10)] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 sm:p-10 flex justify-between items-center border-b border-[var(--color-sage)]/25">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--color-sage)]/20 border border-[var(--color-sage)]/40 flex items-center justify-center">
                  <ShoppingBag size={16} className="text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold leading-none text-[var(--color-gold)]">Your Order</h2>
                  {itemCount > 0 && (
                    <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--color-sage)]/15 rounded-full transition-colors opacity-70 hover:opacity-100">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-7">
              {systemConfig.isOrdersFrozen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center"
                >
                  <p className="text-red-700 text-xs font-bold uppercase tracking-widest">
                    ❄️ {systemConfig.freezeMessage}
                  </p>
                </motion.div>
              )}

              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--color-sage)]/15 border border-[var(--color-sage)]/30 flex items-center justify-center mb-6 text-[var(--color-gold)]">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="font-heading text-lg font-bold opacity-70 text-[var(--color-gold)]">Cart is empty</p>
                  <p className="text-xs opacity-60 mt-1">Add items from the menu</p>
                  <button
                    onClick={onClose}
                    className="mt-6 flex items-center gap-1.5 text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Browse Menu <ChevronRight size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {cart.map(item => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95, x: 20 }}
                          key={`${item.id}-${item.customization}`}
                          className="brandy-card p-4 rounded-2xl flex gap-3.5 items-center group"
                        >
                          <div className="w-14 h-14 bg-[var(--color-sage)]/10 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate text-[var(--color-ivory)]">{item.name}</h4>
                            <p className="text-[var(--color-gold)] font-bold text-xs mt-0.5">{formatPrice(item.price)}</p>
                            {item.customization && (
                              <p className="text-[10px] opacity-60 mt-1 italic truncate">"{item.customization}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1 bg-[var(--color-sage)]/15 border border-[var(--color-sage)]/30 px-2 py-1 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-[var(--color-gold)] transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-[var(--color-gold)] transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500/70 hover:text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <form onSubmit={handleSubmit} id="checkout-form" className="space-y-3 pt-6 border-t border-[var(--color-sage)]/25">
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-3 font-bold text-[var(--color-gold)]">Delivery Details</p>
                    <div className="space-y-2.5">
                      <input
                        required
                        placeholder="Your Name"
                        className="w-full bg-white border border-[var(--color-sage)]/35 rounded-2xl px-4 py-3.5 text-sm focus:border-[var(--color-gold)] focus:bg-white outline-none transition-all placeholder:opacity-55 text-[var(--color-ivory)]"
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full bg-white border border-[var(--color-sage)]/35 rounded-2xl px-4 py-3.5 text-sm focus:border-[var(--color-gold)] focus:bg-white outline-none transition-all placeholder:opacity-55 text-[var(--color-ivory)]"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      />
                      <textarea
                        required
                        placeholder="Delivery Address"
                        rows="2"
                        className="w-full bg-white border border-[var(--color-sage)]/35 rounded-2xl px-4 py-3.5 text-sm focus:border-[var(--color-gold)] focus:bg-white outline-none transition-all resize-none placeholder:opacity-55 text-[var(--color-ivory)]"
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 sm:p-10 border-t border-[var(--color-sage)]/25 space-y-6 bg-[var(--color-sage)]/8">
                {/* Item breakdown */}
                <div className="space-y-1.5">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-xs opacity-70">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[var(--color-sage)]/25">
                  <span className="opacity-75 text-xs uppercase tracking-widest font-bold">Grand Total</span>
                  <span className="text-[var(--color-gold)] text-2xl sm:text-3xl font-heading font-bold">{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={systemConfig.isOrdersFrozen}
                  className="w-full bg-[var(--color-gold)] text-white font-bold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(82,104,45,0.22)] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(82,104,45,0.18)] disabled:grayscale disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Confirm Order
                  <CheckCircle2 size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
