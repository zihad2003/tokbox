import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOrders } from '../context/OrderContext';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const MENU_ITEMS = [
  {
    id: 1,
    title: "Tok Classic",
    price: "59 tk",
    size: "col-span-1",
    img: "/assets/tok classic.png",
    badge: "bestseller",
  },
  {
    id: 2,
    title: "Creamy Tok",
    price: "99 tk",
    size: "col-span-1",
    img: "/assets/creamy tok.png",
    badge: "premium",
  },
  {
    id: 3,
    title: "Tok Boom",
    price: "35 tk",
    size: "col-span-1",
    img: "/assets/tok boom.png",
    badge: null,
  },
  {
    id: 4,
    title: "Tok Bowl",
    price: "49 tk",
    size: "col-span-1",
    img: "/assets/tok bowl.png",
    badge: null,
  }
];

const BADGE_STYLES = {
  bestseller: { label: '★ Best Seller', className: 'bg-[var(--color-gold)] text-white' },
  premium: { label: '✦ Premium', className: 'bg-[var(--color-sage)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/30' },
};

export default function Menu() {
  const sectionRef = useRef(null);
  const { addToCart, systemConfig } = useOrders();

  const [items] = React.useState(MENU_ITEMS);

  return (
    <section id="menu" ref={sectionRef} className="py-28 sm:py-36 lg:py-52 px-6 bg-[var(--color-olive)] relative z-20">
      <div className="max-w-[1200px] mx-auto">
        {systemConfig.isOrdersFrozen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-5 bg-red-50 border border-red-300/50 rounded-2xl text-center"
          >
            <p className="text-red-700 font-bold uppercase tracking-widest text-sm">
              ❄️ {systemConfig.freezeMessage}
            </p>
          </motion.div>
        )}

        <div className="mb-24 text-center">


          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading font-bold mb-4 text-[var(--color-gold)]"
          >
            The <span className="text-[var(--color-sage)]">Menu</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="opacity-60 max-w-xl mx-auto uppercase tracking-[0.3em] text-sm"
          >
            Handcrafted street food.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
  const { addToCart, systemConfig } = useOrders();

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
      xSetter(xPercent * 15);
      ySetter(yPercent * 15);
      glowXSetter(x - rect.width / 2);
      glowYSetter(y - rect.height / 2);
    };

    const handleMouseEnter = () => {
      gsap.to(imgRef.current, { scale: 1.05, duration: 0.4, ease: "power2.out" });
      gsap.to(glowRef.current, { opacity: 0.3, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(imgRef.current, { x: 0, y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
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
      className={`menu-card relative h-[300px] sm:h-[400px] lg:h-[450px] group cursor-pointer ${size} ${systemConfig.isOrdersFrozen ? 'grayscale pointer-events-none opacity-50' : ''}`}
      onClick={handleAddToCart}
    >
      {/* Card background split - Refined for premium look */}
      <div className="absolute inset-0 flex flex-col rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(44,51,34,0.04)] border border-[var(--color-sage)]/20">
        <div className="h-[60%] bg-[#FDFEFA] transition-colors duration-500 group-hover:bg-[#F7F9F2]" />
        <div className="h-[40%] bg-[var(--color-gold)]/5 transition-colors duration-500 group-hover:bg-[var(--color-gold)]/10" />
      </div>

      {/* Magnetic Glow */}
      <div
        ref={glowRef}
        className="absolute w-48 h-48 bg-white/25 blur-[60px] rounded-full opacity-0 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Category Label (Subtle) */}
      <div className="relative z-10 p-4 sm:p-6 pt-6 sm:pt-8 text-center">
        <span className="text-[var(--color-gold)] font-bold text-[9px] uppercase tracking-[0.4em] opacity-40">Street Food</span>
      </div>

      {/* Floating product image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="w-[85%] sm:w-[90%] aspect-square flex items-center justify-center">
          <img
            ref={imgRef}
            src={img}
            alt={title}
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(44,51,34,0.22)] sm:drop-shadow-[0_20px_40px_rgba(44,51,34,0.25)]"
          />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 w-full p-4 sm:p-6 text-center z-10">
        <h3 className="text-[var(--color-ivory)] font-heading text-base sm:text-lg lg:text-xl font-black mb-1 truncate px-2">{title}</h3>
        <p className="text-[var(--color-gold)] font-bold text-[10px] sm:text-xs tracking-wider">({price})</p>

        <div className="flex justify-center mt-3">
          <button className="flex items-center gap-2 bg-[var(--color-gold)] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[11px] font-bold opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 lg:translate-y-4 group-hover:translate-y-0 shadow-[0_4px_15px_rgba(82,104,45,0.2)]">
            <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Add to Order</span>
          </button>
        </div>
      </div>

      {/* Border highlight */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[var(--color-gold)]/10 transition-colors duration-500 rounded-[24px] sm:rounded-[32px] pointer-events-none" />
    </div>
  );
}

