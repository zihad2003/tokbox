import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [textVisible, setTextVisible] = useState(false);

  // --- GSAP Video Scrubbing ---
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // We need to wait for metadata to know the video duration
    const initScroll = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%', // 300vh total scroll distance
          pin: true,
          scrub: 1, // Smoothly catch up to scroll
          onUpdate: (self) => {
            setTextVisible(self.progress >= 0.85);
          }
        }
      });

      // 0% -> 70% scroll: Ingredients assembly (maps to first 70% of video)
      tl.to(video, {
        currentTime: video.duration * 0.7,
        ease: "none",
        duration: 0.7,
      }, 0);

      // 70% -> 85% scroll: Explosion (maps to 70% -> 95% of video)
      tl.to(video, {
        currentTime: video.duration * 0.95,
        ease: "power1.inOut",
        duration: 0.15,
      }, 0.7);

      // 85% -> 100% scroll: Freeze on final frame/result
      tl.to(video, {
        currentTime: video.duration,
        ease: "none",
        duration: 0.15,
      }, 0.85);
    };

    if (video.readyState >= 1) {
      initScroll();
    } else {
      video.addEventListener('loadedmetadata', initScroll);
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#1b1f13] overflow-hidden"
    >
      {/* 2K Cinematic Video Player */}
      <video
        ref={videoRef}
        src="/assets/Fuchka_Explosion_Cinematic_Food_Ad.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      />

      {/* Cinematic Depth Overlays */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
        {/* Gradient Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1b1f13] to-transparent opacity-60" />
      </div>

      {/* Text Overlay Section */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          className="text-center px-6 max-w-5xl"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)',
            filter: textVisible ? 'blur(0px)' : 'blur(10px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="inline-block text-[#c5a059] font-bold tracking-[0.5em] uppercase text-[10px] sm:text-xs mb-8 py-2 px-4 border-y border-[#c5a059]/20 backdrop-blur-sm">
            Doi Fuchka Collective
          </span>
          <h1 className="text-6xl md:text-9xl font-heading font-black text-[#f5f5f1] leading-[0.85] tracking-tighter mb-10 drop-shadow-2xl">
            Doi Fuchka <br />
            <span className="text-[#c5a059] italic">Experience</span>
          </h1>
          <p className="text-xl md:text-3xl text-[#f5f5f1]/70 font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            Taste the explosion of flavors in every handcrafted bite.
          </p>
        </div>
      </div>

      {/* Dynamic Scroll Hint */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-700 pointer-events-none"
        style={{ 
          opacity: textVisible ? 0 : 0.6,
          transform: textVisible ? 'translateY(20px)' : 'translateY(0)'
        }}
      >
        <span className="text-[#f5f5f1] text-[9px] tracking-[0.4em] uppercase font-bold">Initiate Journey</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#c5a059] to-transparent relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#c5a059] animate-bounce" />
        </div>
      </div>
    </section>
  );
}



