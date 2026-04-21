import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart({ isOpen, onClose }) {
  const { cart, addToCart, removeFromCart, clearCart, placeOrder } = useOrders();
  const [isOrdered, setIsOrdered] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder(customer);
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1b1f13] border-l border-[var(--color-gold)]/20 z-[1001] shadow-2xl flex flex-col"
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
              {isOrdered ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4 animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold">Order Placed!</h3>
                  <p className="opacity-60">We've received your order. Steaming hot TokBox is coming your way!</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="italic">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="glass p-4 rounded-2xl flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-[var(--color-gold)] font-bold text-sm">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-red-500/10 text-red-400 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center gap-2 glass px-2 py-1 rounded-lg">
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-8 border-t border-white/5">
                    <h4 className="text-sm uppercase tracking-widest opacity-50 mb-4">Delivery Details</h4>
                    <input 
                      required
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--color-gold)] outline-none transition-colors"
                      value={customer.name}
                      onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                    <input 
                      required
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
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            {!isOrdered && cart.length > 0 && (
              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-gold)]">৳ {total}</span>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-[var(--color-gold)] text-[var(--color-olive)] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
