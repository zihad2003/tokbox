import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const bgTextRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(containerRef.current, {
        opacity: 0,
        duration: 1.5,
      })
      .from(bgTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 2,
      }, "-=1")
      .from(leftContentRef.current.children, {
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
      }, "-=1.5")
      .from(rightContentRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
      }, "-=1.2");

      // Parallax Effects
      gsap.to(rightContentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        rotate: 5,
        ease: "none"
      });

      gsap.to(leftContentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -50,
        ease: "none"
      });

      gsap.to(bgTextRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -150,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen bg-[var(--color-olive)] overflow-hidden flex items-center"
    >
      {/* Background Decorative Text */}
      <div 
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="text-[25vw] font-black text-white/[0.02] leading-none tracking-tighter">
          TOKBOX
        </span>
      </div>

      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-gold)]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center pt-20">
        
        {/* Left: Text Content (The "Proportional" Balance) */}
        <div ref={leftContentRef} className="flex flex-col items-start space-y-6 lg:space-y-8">
          <div className="space-y-2">
            <span className="text-[var(--color-gold)] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Premium Street Food Experience
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-[var(--color-ivory)] leading-[0.9] tracking-tighter">
              TASTE THE <br />
              <span className="text-[var(--color-gold)]">EXTRAORDINARY</span>
            </h1>
          </div>
          
          <p className="text-lg text-[var(--color-ivory)]/60 max-w-md leading-relaxed font-medium">
            Discover the perfect fusion of traditional street flavors and gourmet craftsmanship. Every bite is a journey through excellence.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-4 bg-[var(--color-gold)] text-[var(--color-olive)] font-bold rounded-full hover:bg-[var(--color-ivory)] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(197,160,89,0.3)]">
              ORDER NOW
            </button>
            <button className="px-8 py-4 border border-[var(--color-gold)]/30 text-[var(--color-gold)] font-bold rounded-full hover:bg-[var(--color-gold)]/10 transition-all duration-300">
              VIEW MENU
            </button>
          </div>

          <div className="flex items-center gap-6 pt-8 w-full">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-olive)] bg-[var(--color-gold)]/20 flex items-center justify-center text-[10px] font-bold">
                  {i}k+
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-[var(--color-ivory)]/40 tracking-wider uppercase">
              Happy Customers <br /> Served Daily
            </p>
          </div>
        </div>

        {/* Right: Signature Dish (The "Proportional" Hero) */}
        <div 
          ref={rightContentRef}
          className="relative flex items-center justify-center"
        >
          {/* Main Dish Image */}
          <div className="relative w-full aspect-square max-w-[600px] group">
            <div className="absolute inset-0 bg-[var(--color-gold)]/10 blur-[120px] rounded-full group-hover:bg-[var(--color-gold)]/20 transition-all duration-700" />
            <img 
              src="/assets/tok classic.png" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-float"
              alt="Signature Tok Classic" 
            />
          </div>

          {/* Floating Info Badge */}
          <div className="absolute -right-4 top-1/4 glass p-4 rounded-2xl shadow-2xl border border-[var(--color-gold)]/20 hidden md:block animate-float" style={{ animationDelay: '-2s' }}>
            <p className="text-[var(--color-gold)] font-bold text-xl">100%</p>
            <p className="text-[var(--color-ivory)]/60 text-[10px] uppercase tracking-widest font-bold">Organic Ingredients</p>
          </div>
        </div>

      </div>

    </section>
  );
}

