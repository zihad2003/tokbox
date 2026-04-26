import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAME_PATH = (i) =>
  `/assets/updatedanimation/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`;

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef({ index: 0 });
  const [textVisible, setTextVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // --- Preload all images immediately ---
  useEffect(() => {
    const imgs = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => {
        // Redraw if this frame is currently active but was waiting for load
        if (frameRef.current.index === i) {
          drawFrame(i);
        }
      };
      img.src = FRAME_PATH(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;

    // Initial draw for the first frame
    if (imgs[0].complete) {
      drawFrame(0);
    } else {
      imgs[0].onload = () => drawFrame(0);
    }
  }, []);

  // --- Optimized Draw Function ---
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // Apply a 5% zoom to crop out the 'Veo' watermark from the edges
    const scale = Math.max(cw / iw, ch / ih) * 1.05;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    // Fill with background color to ensure seamless blending
    ctx.fillStyle = '#F7F9F2';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // --- Responsive Canvas Sizing ---
  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth * dpr;
    canvas.height = clientHeight * dpr;
    drawFrame(frameRef.current.index);
  };

  // --- GSAP Scroll Mapping ---
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const scrollData = { frame: 0 };
    
    // Create the master timeline for the hero sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2}`, // Exactly 300vh total
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Reveal text in the final stage
          setTextVisible(self.progress >= 0.82);
          setHasScrolled(self.progress > 0.03);
        }
      }
    });

    // 0% -> 70%: Cinematic Assembly (to frame 168)
    tl.to(scrollData, {
      frame: 168,
      ease: "none",
      duration: 0.7,
      onUpdate: () => {
        const idx = Math.floor(scrollData.frame);
        frameRef.current.index = idx;
        drawFrame(idx);
      }
    }, 0);

    // 70% -> 85%: Explosive Transition (to frame 239)
    tl.to(scrollData, {
      frame: 239,
      ease: "power2.inOut",
      duration: 0.15,
      onUpdate: () => {
        const idx = Math.floor(scrollData.frame);
        frameRef.current.index = idx;
        drawFrame(idx);
      }
    }, 0.7);

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#F7F9F2] overflow-hidden">
      {/* High-Performance Canvas Renderer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ width: '100%', height: '100%', filter: 'contrast(1.05)' }}
      />

      {/* Cinematic Depth Overlays - Refined for clarity */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* Subtle Vignette - Darker for depth, less 'cloudy' */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.2)_100%)]" />
        {/* Minimal Bottom blend */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F7F9F2]/40 to-transparent" />
      </div>

      {/* Pre-Scroll Brand Overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        style={{
          zIndex: 10,
          opacity: hasScrolled ? 0 : 1,
          transform: hasScrolled ? 'translateY(-20px)' : 'translateY(0)',
          filter: hasScrolled ? 'blur(8px)' : 'blur(0px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-white/30" />
            <span className="text-white/90 text-[11px] tracking-[0.6em] uppercase font-bold">The Original</span>
            <div className="h-[1px] w-16 bg-white/30" />
          </div>

          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border border-[#52682D]/15 p-1.5 backdrop-blur-sm bg-white/30 shadow-[0_8px_30px_rgba(82,104,45,0.08)]">
              <div className="w-full h-full rounded-full overflow-hidden border border-[#52682D]/20">
                <img src="/assets/logo.png" alt="TokBox" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-[70px] sm:text-[100px] md:text-[140px] font-heading font-black text-white tracking-[-0.04em] leading-none drop-shadow-sm">
              TOK<span className="text-[#96B85D] italic">BOX</span>
            </h1>
            <p className="text-[12px] sm:text-[16px] text-white/80 uppercase tracking-[0.5em] font-bold">
              Handcrafted Doi Fuchka
            </p>
          </div>
        </div>
      </div>

      {/* Final Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6" style={{ zIndex: 10 }}>
        <div
          className="text-center max-w-5xl"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(40px)',
            filter: textVisible ? 'blur(0px)' : 'blur(10px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="inline-flex items-center gap-3 mb-10 px-5 py-2 border border-[#52682D]/20 rounded-full backdrop-blur-md bg-white/20 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#52682D]" />
            <span className="text-[#52682D] font-bold tracking-[0.4em] uppercase text-[11px]">The Experience</span>
          </div>
          
          <h2 className="text-6xl md:text-[90px] font-heading font-black text-[#2C3322] leading-[0.8] tracking-tighter mb-10">
            Pure <span className="text-[#52682D] italic">Explosion</span>
          </h2>
          
          <p className="text-xl md:text-3xl text-[#2C3322]/60 font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            Where tradition meets a burst of modern craftsmanship.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
        style={{
          zIndex: 20,
          opacity: (!textVisible && !hasScrolled) ? 0.4 : 0,
          transition: 'all 0.6s ease',
        }}
      >
        <span className="text-[#2C3322] text-[9px] tracking-[0.5em] uppercase font-bold">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#52682D] to-transparent relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#52682D] animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}

