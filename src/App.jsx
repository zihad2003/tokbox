import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'leaflet/dist/leaflet.css';
import { Phone, MapPin, Instagram, Facebook, ShoppingBag, Settings, Truck, MessageCircle } from 'lucide-react';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Admin from './components/Admin';
import Cart from './components/Cart';
import { OrderProvider, useOrders } from './context/OrderContext';

gsap.registerPlugin(ScrollTrigger);

import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <OrderProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

function MainLayout() {
  const scrollRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useOrders();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      setIsScrolled(e.scroll > 50);
    });

    // CRITICAL: Ensure ScrollTrigger is refreshed after initial load
    window.addEventListener('load', () => ScrollTrigger.refresh());
    
    // Refresh on any dynamic height changes
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.body);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={scrollRef} className="bg-[var(--color-olive)] min-h-screen text-[var(--color-ivory)] font-body selection:bg-[var(--color-gold)] selection:text-[var(--color-olive)]">
      <div className="grain-overlay" />
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Top Navigation - Added background on scroll and backdrop blur */}
      <nav className={`fixed top-0 left-0 w-full px-6 py-4 md:px-12 md:py-6 z-[100] flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-[var(--color-olive)]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--color-gold)] flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-12">
            <img src="/assets/logo.png" alt="TokBox" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg sm:text-xl font-heading font-bold tracking-tighter text-[var(--color-gold)]">TOKBOX</span>
        </div>
        
        <div className="flex gap-4 sm:gap-8 items-center">
          <div className="hidden lg:flex gap-6 text-sm font-medium tracking-widest uppercase opacity-60">
            <a href="#menu" className="hover:opacity-100 transition-opacity">Menu</a>
            <a href="#delivery" className="hover:opacity-100 transition-opacity">Delivery</a>
            <Link to="/admin" className="hover:opacity-100 transition-opacity flex items-center gap-1">
              <Settings size={14} /> Admin
            </Link>
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
             <button 
               onClick={() => setIsCartOpen(true)}
               className="relative p-2 hover:text-[var(--color-gold)] transition-colors group"
             >
               <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
               {cart.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-[var(--color-olive)] text-[8px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                   {cart.reduce((acc, i) => acc + i.quantity, 0)}
                 </span>
               )}
             </button>
             <Instagram className="w-5 h-5 cursor-pointer hover:text-[var(--color-gold)] transition-colors" />
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Menu />
        <CraftSection />
        <DeliverySection />
      </main>

      <Footer />
    </div>
  );
}

function CraftSection() {
  const pathRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "top 20%",
        scrub: 1,
      }
    });

    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none"
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#1b1f13] flex items-center justify-center overflow-hidden z-10 py-24 sm:py-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

      {/* Cinematic Abstract Line */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="xMidYMid slice" className="opacity-30 lg:opacity-40">
          <path 
            ref={pathRef}
            d="M500,0 C500,200 800,400 800,600 S500,800 500,1000" 
            stroke="var(--color-gold)" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12 lg:mb-24 space-y-4 sm:space-y-6">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-gold)] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-bold"
          >
            The Craftsmanship
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-heading font-black leading-tight sm:leading-none tracking-tighter"
          >
            Elevating <span className="text-[var(--color-gold)] italic">Street Soul</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 items-center lg:items-end">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="craft-card glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] space-y-4 sm:space-y-6 lg:-rotate-3 hover:rotate-0 transition-transform duration-500 order-2 lg:order-1"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
              <span className="text-xl sm:text-2xl font-heading font-bold">01</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-heading font-bold">The Golden Crunch</h4>
            <p className="opacity-40 text-xs sm:text-sm leading-relaxed">Each shell is hand-pressed to ensure the perfect ratio of crispness to bite.</p>
          </motion.div>

          {/* Center Card - Featured */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="craft-card glass-dark p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] space-y-6 sm:space-y-8 border-t-2 border-[var(--color-gold)]/30 lg:scale-110 z-20 shadow-2xl order-1 lg:order-2"
          >
             <div className="relative h-32 sm:h-48 flex items-center justify-center">
                <img src="/assets/tok classic.png" className="w-3/5 sm:w-4/5 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-float" alt="Featured" />
             </div>
             <div className="space-y-2 sm:space-y-4 text-center">
               <h4 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-gold)]">Signature Fusion</h4>
               <p className="opacity-60 text-xs sm:text-sm leading-relaxed">Our secret tamarind water is brewed for 24 hours with 12 distinct spices.</p>
             </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="craft-card glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] space-y-4 sm:space-y-6 lg:rotate-3 hover:rotate-0 transition-transform duration-500 order-3"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
              <span className="text-xl sm:text-2xl font-heading font-bold">03</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-heading font-bold">Dhoi Velvet</h4>
            <p className="opacity-40 text-xs sm:text-sm leading-relaxed">Cultured yogurt whipped into a silky texture that balances the heat.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DeliverySection() {
  const pathRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });

    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none"
    });
  }, []);

  return (
    <section id="delivery" ref={sectionRef} className="relative py-24 px-6 overflow-hidden bg-[#14180d]">
      {/* Background Atmosphere - Darker as in user photo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(197,160,89,0.03)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side Content */}
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.4, y: 0 }}
                viewport={{ once: true }}
                className="text-[var(--color-gold)] uppercase tracking-[0.5em] text-[10px] font-bold"
              >
                Fast Transit
              </motion.h3>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-heading font-bold leading-[0.8] tracking-tighter"
              >
                Tok-to-<br /><span className="text-[var(--color-gold)] italic">Door</span>
              </motion.h2>
            </div>
            
            <div className="space-y-8">
               <DeliveryInfo 
                 title="Rampura Hub" 
                 desc="The heart of our kitchen, where every signature crunch begins its journey." 
                 delay={0.2}
               />
               <DeliveryInfo 
                 title="Dhaka Badda" 
                 desc="Our fast-track transit node ensuring the perfect heat-to-crunch ratio." 
                 delay={0.3}
               />
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 0.3, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-8 flex items-center gap-4"
            >
               <div className="h-[1px] w-12 bg-[var(--color-gold)]/30" />
               <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Dhaka Metropolitan Delivery</span>
            </motion.div>
          </div>

          {/* Right Side Visual - Matches User Provided Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[450px] sm:h-[550px] lg:h-[700px] flex items-center justify-center order-1 lg:order-2"
          >
            <svg 
              viewBox="0 0 400 700" 
              className="w-full h-full max-w-[350px] sm:max-w-[450px]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Path (Dotted or Faint) */}
              <path 
                d="M100 600 C150 550, 350 500, 300 350 S100 200, 200 50" 
                stroke="rgba(197, 160, 89, 0.05)" 
                strokeWidth="2" 
                strokeDasharray="4 8"
              />
              
              {/* Animated Glowing Path */}
              <path 
                ref={pathRef}
                d="M100 600 C150 550, 350 500, 300 350 S100 200, 200 50" 
                stroke="var(--color-gold)" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_20px_var(--color-gold)] opacity-80"
              />
              
              {/* Rampura Node (Large Serif Label) */}
              <motion.g 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="delivery-node"
              >
                <circle cx="100" cy="600" r="12" fill="var(--color-gold)" fillOpacity="0.2" />
                <circle cx="100" cy="600" r="6" fill="var(--color-gold)" className="animate-pulse" />
                <text 
                  x="70" y="660" 
                  fill="var(--color-gold)" 
                  className="text-2xl font-heading font-black uppercase tracking-[0.2em] opacity-80"
                  style={{ textShadow: '0 0 10px rgba(197,160,89,0.3)' }}
                >
                  RAMPURA
                </text>
              </motion.g>
              
              {/* Dhaka Badda Node (Smaller Label) */}
              <motion.g 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="delivery-node"
              >
                <circle cx="300" cy="350" r="8" fill="var(--color-gold)" fillOpacity="0.3" />
                <circle cx="300" cy="350" r="4" fill="var(--color-gold)" />
                <text 
                  x="320" y="355" 
                  fill="var(--color-ivory)" 
                  className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-30"
                >
                  DHAKA BADDA
                </text>
              </motion.g>
              
              {/* Destination Point */}
              <motion.g 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, type: 'spring' }}
                className="delivery-node"
              >
                <circle cx="200" cy="50" r="10" fill="var(--color-gold)" fillOpacity="0.2" />
                <circle cx="200" cy="50" r="5" fill="var(--color-gold)" className="animate-pulse" />
              </motion.g>
            </svg>

            {/* Floating Glassmorphism Info (Matches premium feel) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="absolute top-1/4 right-0 glass p-4 rounded-2xl hidden lg:block animate-float"
            >
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">Live Tracking</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-sm font-bold text-[var(--color-gold)]">Order In Transit</span>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DeliveryInfo({ title, desc, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-start gap-4 group"
    >
      <div className="mt-2 w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)] flex-shrink-0" />
      <div>
        <h4 className="text-xl font-heading font-bold text-[var(--color-gold)]">{title}</h4>
        <p className="opacity-40 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-12 px-6 bg-[#2A2E12] border-t border-[var(--color-gold)]/10 text-[var(--color-ivory)]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Left Side: Contact Info */}
        <div className="space-y-6 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-2 text-[var(--color-gold)]">
              <div className="flex items-center gap-2">
                <Phone size={16} className="opacity-70" />
                <span className="text-sm font-bold tracking-wider">01864959222</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="opacity-70" />
                <span className="text-sm font-bold tracking-wider">01864959222</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-3 opacity-60">
              <MapPin size={16} className="text-[var(--color-gold)] flex-shrink-0" />
              <p className="text-sm leading-relaxed font-medium">
                Block-A, Sayeed Nagar, Vatara, Dhaka 1212
              </p>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-3 opacity-60">
              <Truck size={16} className="text-[var(--color-gold)]" />
              <p className="text-xs uppercase tracking-[0.2em] font-bold">Delivery Available</p>
            </div>
          </div>
        </div>

        {/* Right Side: Social Connections */}
        <div className="flex gap-8 md:gap-12">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-[var(--color-gold)]/30 flex items-center justify-center group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-olive)] transition-all">
              <Facebook size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Facebook</p>
              <p className="text-sm font-bold">TokBox</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-[var(--color-gold)]/30 flex items-center justify-center group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-olive)] transition-all">
              <Instagram size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Instagram</p>
              <p className="text-sm font-bold">@tokbox.bd</p>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-20 text-[9px] uppercase tracking-[0.4em] font-bold">
        <p>© 2026 TOKBOX COLLECTIVE</p>
        <p className="hidden sm:block">Handcrafted in Dhaka</p>
      </div>
    </footer>
  );
}
