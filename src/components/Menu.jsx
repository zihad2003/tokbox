import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOrders } from '../context/OrderContext';
import { Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MENU_ITEMS = [
  {
    id: 1,
    title: "Tok Classic",
    price: "59 tk",
    size: "col-span-1",
    img: "/assets/tok classic.png"
  },
  {
    id: 2,
    title: "Creamy Tok",
    price: "99 tk",
    size: "col-span-1",
    img: "/assets/creamy tok.png"
  },
  {
    id: 3,
    title: "Tok Boom",
    price: "35 tk",
    size: "col-span-1",
    img: "/assets/tok boom.png"
  },
  {
    id: 4,
    title: "Tok Bowl",
    price: "49 tk",
    size: "col-span-1",
    img: "/assets/tok bowl.png"
  }
];

import { motion } from 'framer-motion';

export default function Menu() {
  const sectionRef = useRef(null);
  const { addToCart, systemConfig } = useOrders();

  // Simulated fetch from D1 (since I don't have the Cloudflare environment)
  const [items, setItems] = React.useState(MENU_ITEMS);

  return (
    <section id="menu" ref={sectionRef} className="py-24 sm:py-32 lg:py-48 px-6 bg-[var(--color-olive)] relative z-20">
      <div className="max-w-[1200px] mx-auto">
        {systemConfig.isOrdersFrozen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-4 glass-dark border border-red-500/30 rounded-2xl text-center"
          >
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">
              ❄️ {systemConfig.freezeMessage}
            </p>
          </motion.div>
        )}

        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading font-bold mb-4"
          >
            The <span className="text-[var(--color-gold)]">Collection</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg opacity-50 max-w-xl mx-auto uppercase tracking-widest"
          >
            Handcrafted street food elevated for the modern palate.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <MenuCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuCard({ id, title, price, size, img }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glowRef = useRef(null);
  const contentRef = useRef(null);
  const { addToCart, systemConfig } = useOrders();

  // Convert string price to number for the new context
  const numericPrice = parseInt(price.replace(' tk', ''));

  const handleAddToCart = () => {
    if (systemConfig.isOrdersFrozen) return;
    addToCart({
      id: String(id),
      name: title,
      price: numericPrice,
      image: img,
      category: 'Street Food',
      description: 'Handcrafted signature dish',
      isAvailable: true
    });
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const xSetter = gsap.quickSetter(imgRef.current, "x", "px");
    const ySetter = gsap.quickSetter(imgRef.current, "y", "px");
    const glowXSetter = gsap.quickSetter(glowRef.current, "x", "px");
    const glowYSetter = gsap.quickSetter(glowRef.current, "y", "px");

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width - 0.5);
      const yPercent = (y / rect.height - 0.5);

      xSetter(xPercent * 20);
      ySetter(yPercent * 20);
      
      glowXSetter(x - rect.width / 2);
      glowYSetter(y - rect.height / 2);
    };

    const handleMouseEnter = () => {
      gsap.to(imgRef.current, { 
        scale: 1.1, 
        duration: 0.4, 
        ease: "power2.out" 
      });
      gsap.to(glowRef.current, { opacity: 0.4, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(imgRef.current, { 
        x: 0, 
        y: 0, 
        scale: 1, 
        duration: 0.4, 
        ease: "power2.out" 
      });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`menu-card relative h-[380px] sm:h-[450px] group cursor-pointer perspective-1000 z-1 ${size} ${systemConfig.isOrdersFrozen ? 'grayscale pointer-events-none opacity-60' : ''}`}
      onClick={handleAddToCart}
    >
      {/* Background Split with rounded corners and overflow hidden */}
      <div className="absolute inset-0 flex flex-col rounded-[32px] overflow-hidden">
        <div className="h-3/5 bg-[#2A2E12] transition-colors group-hover:bg-[#323618]" />
        <div className="h-2/5 bg-[var(--color-gold)] transition-colors group-hover:bg-[#d4ae65]" />
      </div>

      {/* Magnetic Glow */}
      <div 
        ref={glowRef}
        className="absolute w-64 h-64 bg-[var(--color-gold)]/20 blur-[80px] rounded-full opacity-0 pointer-events-none transition-opacity left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Top Content */}
      <div className="relative z-10 p-8 pt-10 text-center">
        <h4 className="text-[var(--color-gold)] font-heading text-3xl font-bold tracking-tight opacity-80">TokBox</h4>
      </div>

      {/* Floating Image - Overlapping text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className={`w-[90%] sm:w-[95%] aspect-square flex items-center justify-center ${title === 'Tok Classic' ? 'scale-125' : 'scale-100'}`}>
          <img 
            ref={imgRef}
            src={img} 
            alt={title} 
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {/* Bottom Content */}
      <div ref={contentRef} className="absolute bottom-0 w-full p-8 text-center z-10">
        <h3 className="text-[#2A2E12] font-heading text-2xl font-bold mb-1">{title}</h3>
        <p className="text-[#2A2E12]/80 font-bold text-lg mb-4">({price})</p>
        
        <div className="flex justify-center">
          <button 
            className="flex items-center gap-2 bg-[#2A2E12] text-[var(--color-gold)] px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all transform translate-y-0 lg:translate-y-4 group-hover:translate-y-0"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            Add to Order
          </button>
        </div>
      </div>

      {/* Border Highlight */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-[var(--color-gold)]/30 transition-colors rounded-[32px] pointer-events-none" />
    </div>
  );
}
