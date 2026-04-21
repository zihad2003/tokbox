import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'leaflet/dist/leaflet.css';
import { Phone, MapPin, Instagram, Facebook, ShoppingBag, Settings } from 'lucide-react';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Admin from './components/Admin';
import Cart from './components/Cart';
import { OrderProvider, useOrders } from './context/OrderContext';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  return (
    <OrderProvider>
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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
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
  const contentRef = useRef(null);

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
    })
    .from(".craft-card", {
      y: 80,
      opacity: 0,
      stagger: 0.1,
      scale: 0.9,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3")
    .from(".craft-title-reveal", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.5");
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#1b1f13] flex items-center justify-center overflow-hidden z-10">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

      {/* Cinematic Abstract Line - Simplified for Mobile */}
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
          <h3 className="craft-title-reveal text-[var(--color-gold)] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-bold opacity-60">The Craftsmanship</h3>
          <h2 className="craft-title-reveal text-4xl sm:text-6xl lg:text-8xl font-heading font-black leading-tight sm:leading-none tracking-tighter">
            Elevating <span className="text-[var(--color-gold)] italic">Street Soul</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 items-center lg:items-end">
          {/* Card 1 */}
          <div className="craft-card glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] space-y-4 sm:space-y-6 lg:-rotate-3 hover:rotate-0 transition-transform duration-500 order-2 lg:order-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
              <span className="text-xl sm:text-2xl font-heading font-bold">01</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-heading font-bold">The Golden Crunch</h4>
            <p className="opacity-40 text-xs sm:text-sm leading-relaxed">Each shell is hand-pressed to ensure the perfect ratio of crispness to bite.</p>
          </div>

          {/* Center Card - Featured */}
          <div className="craft-card glass-dark p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] space-y-6 sm:space-y-8 border-t-2 border-[var(--color-gold)]/30 lg:scale-110 z-20 shadow-2xl order-1 lg:order-2">
             <div className="relative h-32 sm:h-48 flex items-center justify-center">
                <img src="/assets/tok classic.png" className="w-3/5 sm:w-4/5 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-float" alt="Featured" />
             </div>
             <div className="space-y-2 sm:space-y-4 text-center">
               <h4 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-gold)]">Signature Fusion</h4>
               <p className="opacity-60 text-xs sm:text-sm leading-relaxed">Our secret tamarind water is brewed for 24 hours with 12 distinct spices.</p>
             </div>
          </div>

          {/* Card 3 */}
          <div className="craft-card glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] space-y-4 sm:space-y-6 lg:rotate-3 hover:rotate-0 transition-transform duration-500 order-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
              <span className="text-xl sm:text-2xl font-heading font-bold">03</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-heading font-bold">Dhoi Velvet</h4>
            <p className="opacity-40 text-xs sm:text-sm leading-relaxed">Cultured yogurt whipped into a silky texture that balances the heat.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverySection() {
  const svgRef = useRef(null);
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
    })
    .from(".delivery-node", {
      scale: 0,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.5")
    .from(".delivery-text-reveal", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1");
  }, []);

  return (
    <section id="delivery" ref={sectionRef} className="relative py-24 px-6 overflow-hidden bg-[#1b1f13]">
      {/* Background Map Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale invert mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="delivery-text-reveal text-5xl md:text-7xl font-heading font-bold leading-tight">
              Tok-to-<span className="text-[var(--color-gold)] italic">Door</span>
            </h2>
            <div className="space-y-4">
               <DeliveryInfo title="Rampura Hub" desc="Our culinary heart, where the magic begins." />
               <DeliveryInfo title="Dhaka Badda" desc="Fast-track transit through the city's pulse." />
               <DeliveryInfo title="Kuril Terminal" desc="Delivering gourmet crunch to the northern edge." />
            </div>
          </div>

          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center order-1 lg:order-2 px-4 sm:px-0">
            <svg 
              ref={svgRef}
              viewBox="0 0 400 600" 
              className="w-full h-full max-w-[280px] sm:max-w-none drop-shadow-[0_0_30px_rgba(197,160,89,0.1)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M100 500 C150 480, 250 450, 300 350 S100 250, 200 100" 
                stroke="rgba(197, 160, 89, 0.05)" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              
              <path 
                ref={pathRef}
                d="M100 500 C150 480, 250 450, 300 350 S100 250, 200 100" 
                stroke="var(--color-gold)" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_15px_var(--color-gold)]"
              />
              
              <g className="delivery-node">
                <circle cx="100" cy="500" r="10" fill="var(--color-gold)" className="animate-pulse" />
                <text x="70" y="540" fill="var(--color-gold)" className="text-sm font-heading font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">Rampura</text>
              </g>
              
              <g className="delivery-node">
                <circle cx="300" cy="350" r="8" fill="var(--color-gold)" fillOpacity="0.6" />
                <text x="320" y="355" fill="var(--color-ivory)" className="text-[10px] font-bold uppercase tracking-widest opacity-40">Dhaka Badda</text>
              </g>
              
              <g className="delivery-node">
                <circle cx="200" cy="100" r="10" fill="var(--color-gold)" className="animate-pulse" />
                <text x="220" y="105" fill="var(--color-gold)" className="text-sm font-heading font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">Kuril</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryInfo({ title, desc }) {
  return (
    <div className="delivery-text-reveal flex items-start gap-4 group">
      <div className="mt-2 w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)] flex-shrink-0" />
      <div>
        <h4 className="text-xl font-heading font-bold text-[var(--color-gold)]">{title}</h4>
        <p className="opacity-40 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-12 sm:py-20 px-6 border-t border-[var(--color-gold)]/10 bg-[#1b1f13]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 mb-12 sm:mb-20">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-gold)] mb-2 tracking-tighter">TOKBOX</h2>
            <p className="opacity-40 text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold">Gourmet Street Food Redefined</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
             <p className="text-[10px] sm:text-sm opacity-50 uppercase tracking-[0.2em]">Contact Us</p>
             <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-[var(--color-gold)] hover:scale-105 transition-transform cursor-pointer">
               WhatsApp: +91 377 853 000
             </div>
             <div className="flex gap-6 sm:gap-8 mt-2 opacity-60">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 hover:text-[var(--color-gold)] cursor-pointer" />
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 hover:text-[var(--color-gold)] cursor-pointer" />
             </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em]">
          <p>© 2026 TOKBOX COLLECTIVE</p>
          <p className="text-center md:text-right">Handcrafted for the Streets of Dhaka</p>
        </div>
      </div>
    </footer>
  );
}
