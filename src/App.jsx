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
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  return (
    <OrderProvider>
      <Toaster position="bottom-right" reverseOrder={false} toastOptions={{
        style: { background: '#FFFFFF', color: '#2C3322', border: '1px solid rgba(150,184,93,0.35)', borderRadius: '14px', boxShadow: '0 6px 24px rgba(82,104,45,0.10)' }
      }} />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    window.addEventListener('load', () => ScrollTrigger.refresh());

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
    <div ref={scrollRef} className="bg-[var(--color-olive)] min-h-screen text-[var(--color-ivory)] font-body selection:bg-[var(--color-gold)] selection:text-[#FFFFFF]">
      <div className="grain-overlay" />

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-5 md:px-14 md:py-6 z-[100] flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-[var(--color-olive)]/90 backdrop-blur-xl border-b border-[var(--color-sage)]/30 shadow-[0_2px_20px_rgba(82,104,45,0.05)] text-[var(--color-ivory)]' : 'bg-transparent text-white'}`}>
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--color-gold)] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:rotate-12">
            <img src="/assets/logo.png" alt="TokBox" className="w-full h-full object-cover" />
          </div>
          <span className={`text-lg sm:text-xl font-heading font-bold tracking-tighter transition-colors duration-500 ${isScrolled ? 'text-[var(--color-gold)]' : 'text-white'}`}>TOKBOX</span>
        </Link>

        <div className="flex gap-3 sm:gap-5 items-center">
          {/* Desktop links */}
          <div className={`hidden lg:flex gap-8 text-sm font-medium tracking-widest uppercase ${isScrolled ? 'text-[var(--color-ivory)]' : 'text-white'}`}>
            <a href="#menu" className="nav-link-underline opacity-50 hover:opacity-100 transition-opacity">Menu</a>
            <a href="#delivery" className="nav-link-underline opacity-50 hover:opacity-100 transition-opacity">Delivery</a>
            <Link to="/admin" className="nav-link-underline opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1.5">
              <Settings size={13} /> Admin
            </Link>
          </div>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 hover:text-[var(--color-gold)] transition-colors ${isScrolled ? 'text-[var(--color-ivory)]' : 'text-white'}`}
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-white text-[8px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                >
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Instagram */}
          <a href="https://instagram.com/tokbox.bd" target="_blank" rel="noopener noreferrer" className={isScrolled ? 'text-[var(--color-ivory)]' : 'text-white'}>
            <Instagram className="w-5 h-5 cursor-pointer hover:text-[var(--color-gold)] transition-colors" />
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 flex flex-col gap-[5px] group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 bg-[var(--color-olive)]/98 backdrop-blur-xl z-[99] flex flex-col items-center justify-center gap-10 lg:hidden"
          >
            {[
              { href: '#menu', label: 'Menu' },
              { href: '#delivery', label: 'Delivery' },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-5xl sm:text-6xl font-heading font-bold hover:text-[var(--color-gold)] transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-5xl sm:text-6xl font-heading font-bold hover:text-[var(--color-gold)] transition-colors"
              >
                Admin
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="absolute bottom-12 flex items-center gap-4 opacity-30"
            >
              <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
              <span className="text-[8px] tracking-[0.6em] uppercase font-bold text-[var(--color-gold)]">TOKBOX · DHAKA</span>
              <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 lg:py-64 bg-[#F7F9F2] overflow-hidden"
    >
      {/* Background Depth Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-[#96B85D]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-[#52682D]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-24 lg:mb-48 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[1px] bg-[#52682D]" />
            <span className="text-[#52682D] text-[10px] tracking-[0.6em] uppercase font-bold">The Art of TokBox</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[120px] font-heading font-black text-[#2C3322] leading-[0.9] tracking-tighter"
          >
            Elevating <br />
            <span className="text-[#52682D] italic pr-4">Street Soul</span>
          </motion.h2>
        </div>

        {/* Feature 01 - Large Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-32 lg:mb-64">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-video rounded-[40px] overflow-hidden group bg-white border border-[#52682D]/10 shadow-[0_10px_40px_rgba(82,104,45,0.05)]"
            >
              <img 
                src="/assets/tok classic.png" 
                className="w-full h-full object-contain p-12 transition-transform duration-1000 group-hover:scale-110" 
                alt="Crafting" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F2]/40 via-transparent to-transparent opacity-60" />
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-[#52682D] font-heading text-6xl lg:text-8xl font-black opacity-10">01</span>
              <h3 className="text-3xl lg:text-5xl font-heading font-bold text-[#2C3322] leading-tight">
                The Golden <br /><span className="text-[#52682D]">Precision</span>
              </h3>
            </div>
            <p className="text-lg lg:text-xl text-[#2C3322]/60 leading-relaxed font-light">
              Each shell is hand-pressed and precision-fried to ensure a mathematical ratio of crispness to bite, creating a foundation that never wavers under the weight of tradition.
            </p>
            <div className="w-12 h-[1px] bg-[#52682D]/30" />
          </div>
        </div>

        {/* Feature 02 - Overlapping Center/Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-32 lg:mb-64">
          <div className="lg:col-span-5 lg:col-start-2 space-y-8">
            <div className="space-y-4">
              <span className="text-[#52682D] font-heading text-6xl lg:text-8xl font-black opacity-10">02</span>
              <h3 className="text-3xl lg:text-5xl font-heading font-bold text-[#2C3322] leading-tight">
                Twenty-Four <br /><span className="text-[#52682D]">Hour Brew</span>
              </h3>
            </div>
            <p className="text-lg lg:text-xl text-[#2C3322]/60 leading-relaxed font-light">
              Our signature tamarind essence isn't made; it's cultured. A complex brew of 12 distinct spices, aged for exactly 24 hours to reach peak acidity and floral depth.
            </p>
            <div className="w-12 h-[1px] bg-[#52682D]/30" />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative p-12 lg:p-24 bg-white border border-[#52682D]/10 rounded-[60px] shadow-[0_20px_50px_rgba(82,104,45,0.08)] overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8">
                <div className="w-16 h-16 rounded-full border border-[#52682D]/20 flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-[#52682D]" />
                </div>
              </div>
              <img 
                src="/assets/tok boom.png" 
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105" 
                alt="Brew" 
              />
            </motion.div>
          </div>
        </div>

        {/* Final CTA/Vision Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          <div className="w-px h-24 bg-gradient-to-b from-[#52682D] to-transparent mx-auto" />
          <h4 className="text-3xl lg:text-5xl font-heading font-medium text-[#2C3322] leading-snug italic">
            "We don't just serve food; we preserve the vibration of Dhaka's streets in a single, perfectly crafted bite."
          </h4>
          <div className="flex items-center justify-center gap-4">
            <span className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#52682D]">The Collective</span>
          </div>
        </motion.div>
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
        scrub: 1.5,
      }
    });

    tl.to(pathRef.current, { strokeDashoffset: 0, ease: "none" });
  }, []);

  return (
    <section id="delivery" ref={sectionRef} className="relative py-32 lg:py-48 px-6 overflow-hidden bg-[#F7F9F2]">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[#96B85D]/5 skew-x-12 transform origin-top-right pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(150,184,93,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Text Content - Left */}
          <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-3 py-1 bg-[#52682D]/5 rounded-full border border-[#52682D]/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#52682D] animate-pulse" />
                <span className="text-[#52682D] uppercase tracking-[0.4em] text-[9px] font-bold">Fast Transit</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-[90px] font-heading font-black leading-[0.85] tracking-tighter text-[#2C3322]"
              >
                Tok-to-<br /><span className="text-[#52682D] italic">Door</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#F7F9F2] bg-[#96B85D]/20 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-[#52682D]/10" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-[#52682D]/80">30–45 min <span className="opacity-40 font-medium">delivery average</span></p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-8">
              <motion.a
                href="https://wa.me/8801864959222"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-[#52682D] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-[0_15px_30px_rgba(82,104,45,0.15)] transition-all"
              >
                <MessageCircle size={18} />
                Order via WhatsApp
              </motion.a>

              <div className="flex items-center gap-4 px-4 opacity-40">
                <div className="h-px w-10 bg-[#2C3322]" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#2C3322]">Dhaka Metro</span>
              </div>
            </div>
          </div>

          {/* SVG Visual - Right */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 h-[500px] lg:h-[700px] w-full">
            {/* Live Tracking Card - Positioned for both mobile & desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute top-0 right-0 sm:right-10 z-20 bg-white/80 backdrop-blur-md border border-[#52682D]/10 p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center gap-4 animate-float"
            >
              <div className="w-10 h-10 rounded-full bg-[#52682D]/10 flex items-center justify-center">
                <Truck size={18} className="text-[#52682D]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-black text-[#52682D]/40 mb-0.5">Live Tracking</p>
                <p className="text-sm font-bold text-[#2C3322]">Order In Transit</p>
              </div>
            </motion.div>

            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="-50 0 500 700"
                className="h-full w-auto max-w-full drop-shadow-[0_20px_50px_rgba(82,104,45,0.08)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background path shadow */}
                <path
                  d="M100 600 C150 550, 350 500, 300 350 S100 200, 200 50"
                  stroke="#52682D"
                  strokeWidth="8"
                  strokeOpacity="0.03"
                  strokeLinecap="round"
                />
                <path
                  d="M100 600 C150 550, 350 500, 300 350 S100 200, 200 50"
                  stroke="rgba(82, 104, 45, 0.1)"
                  strokeWidth="2"
                  strokeDasharray="6 10"
                  strokeLinecap="round"
                />
                <path
                  ref={pathRef}
                  d="M100 600 C150 550, 350 500, 300 350 S100 200, 200 50"
                  stroke="#52682D"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Rampura Node */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <circle cx="100" cy="600" r="18" fill="white" className="shadow-sm" />
                  <circle cx="100" cy="600" r="12" fill="#52682D" fillOpacity="0.1" />
                  <circle cx="100" cy="600" r="6" fill="#52682D" />
                  <text
                    x="100" y="650"
                    fill="#52682D"
                    textAnchor="middle"
                    className="font-heading font-black"
                    style={{ fontSize: '20px', letterSpacing: '0.1em' }}
                  >
                    RAMPURA
                  </text>
                </motion.g>

                {/* Badda Node */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <circle cx="300" cy="350" r="14" fill="white" />
                  <circle cx="300" cy="350" r="8" fill="#52682D" fillOpacity="0.1" />
                  <circle cx="300" cy="350" r="4" fill="#52682D" />
                  <text
                    x="300" y="320"
                    fill="#2C3322"
                    textAnchor="middle"
                    className="font-bold opacity-60"
                    style={{ fontSize: '14px', letterSpacing: '0.15em' }}
                  >
                    DHAKA BADDA
                  </text>
                </motion.g>

                {/* Destination */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <circle cx="200" cy="50" r="22" fill="#52682D" fillOpacity="0.05" />
                  <circle cx="200" cy="50" r="10" fill="#52682D" />
                  <circle cx="200" cy="50" r="6" fill="white" className="animate-ping" />
                </motion.g>
              </svg>
            </div>
          </div>
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
      className="group relative pl-8 border-l-2 border-[#52682D]/10 hover:border-[#52682D]/40 transition-colors"
    >
      <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-[#52682D] group-hover:scale-150 transition-transform" />
      <h4 className="text-2xl font-heading font-black text-[#52682D] tracking-tight">{title}</h4>
      <p className="opacity-60 text-[#2C3322] text-sm mt-2 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="pt-24 pb-12 px-6 bg-white border-t border-[#52682D]/10 text-[#2C3322]">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-20">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl border border-[#52682D]/10 p-2 bg-[#F7F9F2]">
                <img src="/assets/logo.png" alt="TokBox" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-black text-[#52682D] tracking-tighter">TOKBOX</h2>
                <p className="text-[10px] opacity-40 uppercase tracking-[0.6em] font-black">Dhaka's Finest</p>
              </div>
            </div>
            <p className="text-lg text-[#2C3322]/60 leading-relaxed max-w-sm">
              Preserving the vibration of Dhaka's streets in a single, perfectly crafted bite. Pure explosion in every box.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#52682D]">Connect</h4>
            <div className="space-y-4">
              <a href="tel:01864959222" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#52682D]/5 flex items-center justify-center group-hover:bg-[#52682D] group-hover:text-white transition-all">
                  <Phone size={14} />
                </div>
                <span className="text-sm font-bold tracking-wider opacity-80 group-hover:opacity-100">01864959222</span>
              </a>
              <a href="https://wa.me/8801864959222" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#52682D]/5 flex items-center justify-center group-hover:bg-[#52682D] group-hover:text-white transition-all">
                  <MessageCircle size={14} />
                </div>
                <span className="text-sm font-bold tracking-wider opacity-80 group-hover:opacity-100">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Location Info */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#52682D]">Location</h4>
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[#52682D]/5 flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-[#52682D]" />
              </div>
              <p className="text-sm leading-relaxed font-bold opacity-80">
                Block-A, Sayeed Nagar, Vatara,<br />
                Dhaka 1212, Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-12 border-t border-[#52682D]/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex gap-8">
            <a href="https://facebook.com/tokbox.bd" className="text-[#52682D]/40 hover:text-[#52682D] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com/tokbox.bd" className="text-[#52682D]/40 hover:text-[#52682D] transition-colors">
              <Instagram size={20} />
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[9px] uppercase tracking-[0.4em] font-black text-[#2C3322]/30 text-center">
            <p>© 2026 TokBox Collective</p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-[#52682D]/20" />
            <p>Handcrafted in Dhaka</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


