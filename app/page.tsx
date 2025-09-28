import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Milton Keynes Ceramic Coating — One-page scroll demo
 *
 * Features
 * - Full-screen cleaning panel on load; header fades in as you start scrolling
 * - Dirt layer reveals clean paint from top→bottom as you scroll
 * - Water sheet with wavy edge + highlights follows the cleaning edge
 * - Sparkly bling appears near completion
 * - Hero headline with metallic gold shimmer
 */

export default function Site() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollerRef,
    offset: ["start start", "end end"],
  });

  // Map progress -> CSS variables / positions
  const progressPct = useTransform(scrollYProgress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
  const waterY = useTransform(scrollYProgress, (v) => `calc(${Math.min(Math.max(v, 0), 1) * 100}% - 8rem)`); // follow the edge
  const blingOpacity = useTransform(scrollYProgress, [0.9, 0.95, 1], [0, 0, 1]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  // Random dirt pattern generators (recomputed on refresh)
  const mudPatches = useMemo(() => {
    const blobs = Array.from({ length: 6 }, () => {
      const x = Math.floor(10 + Math.random() * 80);
      const y = Math.floor(20 + Math.random() * 70);
      const w = 18 + Math.random() * 28; // % width
      const h = 12 + Math.random() * 20; // % height
      const opa = 0.45 + Math.random() * 0.25;
      return `radial-gradient(${w}% ${h}% at ${x}% ${y}%, rgba(168,142,104,${opa}) 40%, rgba(0,0,0,0) 66%)`;
    });
    return blobs.join(',');
  }, []);

  const sandDots = useMemo(() => {
    const dots = Array.from({ length: 90 }, () => {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(20 + Math.random() * 80);
      const r = (1 + Math.random() * 1.5).toFixed(1);
      const a = (0.35 + Math.random() * 0.35).toFixed(2);
      return `radial-gradient(circle ${r}px at ${x}% ${y}%, rgba(196,176,140,${a}) 50%, transparent 51%)`;
    });
    return dots.join(',');
  }, []);

  const saltDots = useMemo(() => {
    const dots = Array.from({ length: 70 }, () => {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(35 + Math.random() * 65);
      const a = (0.65 + Math.random() * 0.3).toFixed(2);
      return `radial-gradient(circle 1px at ${x}% ${y}%, rgba(255,255,255,${a}) 55%, transparent 56%)`;
    });
    return dots.join(',');
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Header / Brand (fades in after initial scroll) */}
      <motion.header style={{ opacity: headerOpacity }} className="fixed top-0 left-0 right-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-bold tracking-wide">Milton Keynes Ceramic Coating</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <a href="https://wa.me/447356250814?text=Hi%20there%2C%20I%27d%20like%20a%20quote%20for%20ceramic%20coating" className="px-4 py-2 rounded-xl bg-green-500/90 hover:bg-green-400 font-semibold shadow-md shadow-green-500/20">WhatsApp</a>
            <a href="mailto:info@miltonkeynesceramiccoating.co.uk?subject=Ceramic%20Coating%20Quote&body=Hi%20there%2C%20please%20include%20make%2Fmodel%2C%20photos%2C%20and%20preferred%20date." className="px-4 py-2 rounded-xl bg-pink-500/90 hover:bg-pink-400 font-semibold shadow-md shadow-pink-500/20">Email me</a>
            <a href="tel:+447356250814" className="px-4 py-2 rounded-xl bg-cyan-500/90 hover:bg-cyan-400 font-semibold shadow-md shadow-cyan-500/20">Call now</a>
          </div>
        </div>
      </motion.header>

      {/* Scroll-driven wash effect (shorter: ~3 screens) */}
      <section ref={scrollerRef} className="relative h-[200vh]" aria-label="Scroll to wash the door panel">
        {/* Sticky stage */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Road/backdrop tint */}
          <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none bg-[radial-gradient(100%_50%_at_50%_0%,#0ea5e9_0%,transparent_50%),linear-gradient(to_bottom,#020617,transparent_35%,#020617)]" />

          {/* Car door panel container */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              ["--reveal" as any]: progressPct,
            }}
          >
            {/* CLEAN layer (base) */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,#1f2937,35%,#334155_50%,#0ea5e9_110%)]" />
            </div>

            {/* DIRT layer — clipped away from the top as you scroll */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                clipPath: `inset(var(--reveal) 0 0 0)`,
              }}
            >
              {/* lighter mud base (tan/beige) */}
              <div className="absolute inset-0" style={{
                opacity: 0.92,
                backgroundImage: ['linear-gradient(180deg, #7d6a52 0%, #a8926c 100%)', mudPatches].join(',')
              }} />

              {/* random blotches overlay (varies per load) */}
              <div className="absolute inset-0" style={{ mixBlendMode: 'multiply', opacity: 0.6, backgroundImage: mudPatches }} />

              {/* sand grains (warm) */}
              <div className="absolute inset-0" style={{
                opacity: 0.35,
                mixBlendMode: 'multiply',
                backgroundImage: sandDots ,
                maskImage: 'linear-gradient(to bottom, transparent 0% , black 30%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0% , black 30%, black 100%)'
              }} />

              {/* salt crystals (bright specks) */}
              <div className="absolute inset-0" style={{
                opacity: 0.28,
                mixBlendMode: 'screen',
                backgroundImage: saltDots ,
                maskImage: 'linear-gradient(to bottom, transparent 0% , black 35%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0% , black 35%, black 100%)'
              }} />

              {/* drip streaks */}
              <div className="absolute inset-0" style={{
                opacity: 0.45,
                mixBlendMode: 'multiply',
                backgroundImage: 'repeating-linear-gradient(to bottom, rgba(125,110,90,0.25) 0 6px, rgba(125,110,90,0.0) 8px 18px), repeating-linear-gradient(to bottom, rgba(125,110,90,0.16) 0 3px, rgba(125,110,90,0.0) 4px 12px)',
                maskImage: 'linear-gradient(to bottom, transparent 0% , black 30% , black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0% , black 30% , black 100%)'
              }} />
            </div>

            {/* WATER sheet following the cleaning edge */}
            <motion.div
              className="absolute left-0 right-0 h-56 pointer-events-none"
              style={{ top: waterY }}
            >
              {/* translucent water body with moving highlights */}
              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPositionX: ["0%", "100%"] }}
                transition={{ repeat: Infinity, repeatType: "loop", duration: 4, ease: "linear" }}
                style={{
                  backgroundImage:
                    `linear-gradient(to bottom, rgba(59,130,246,0.35), rgba(59,130,246,0.25) 35%, rgba(59,130,246,0.12) 70%, rgba(59,130,246,0)) ,` +
                    `radial-gradient(40px 20px at 10% 30%, rgba(255,255,255,0.35), transparent 60%),` +
                    `radial-gradient(60px 24px at 60% 60%, rgba(255,255,255,0.25), transparent 65%)`,
                  backgroundSize: "auto, 240px 120px, 240px 120px",
                  backgroundRepeat: "repeat, repeat, repeat",
                  mixBlendMode: "screen",
                  opacity: 0.9,
                }}
              />

              {/* wavy leading edge */}
              <motion.svg
                initial={false}
                viewBox="0 0 1440 80"
                className="absolute -top-6 left-0 w-[120%] -translate-x-[10%]"
                animate={{ x: ["0%", "-10%", "0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <defs>
                  <linearGradient id="waterEdge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0.45)" />
                  </linearGradient>
                </defs>
                <path d="M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1440,80 1620,40 L1620,120 L0,120 Z" fill="url(#waterEdge)" fillOpacity="0.85"/>
              </motion.svg>

              {/* falling streaks */}
              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPositionY: ["0px", "120px"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.25) 0 8px, rgba(255,255,255,0.05) 8px 16px)",
                  maskImage: "linear-gradient(to bottom, black, black 60%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, black 60%, transparent 100%)",
                  opacity: 0.3,
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>

            {/* BLING (appears near completion) */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: blingOpacity }}
            >
              <Sparkle x="20%" y="30%" size={26} />
              <Sparkle x="72%" y="40%" size={18} delay={0.1} />
              <Sparkle x="55%" y="65%" size={22} delay={0.2} />
              <Sparkle x="35%" y="50%" size={16} delay={0.35} />
            </motion.div>

            {/* subtle border shine */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
          </motion.div>
        </div>
      </section>

      {/* Hero (revealed after the wash begins) */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            style={{ scale: headlineScale, opacity: headlineOpacity }}
            className="py-16 sm:py-24 md:py-28 text-center relative md:-translate-y-2"
          >
            <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight leading-[0.95] mx-auto max-w-[16ch]">
              <span className="inline-block underline decoration-amber-300 decoration-4 underline-offset-8 sm:underline-offset-10">
                <ShimmerText>Clean car, effortlessly</ShimmerText>
              </span>
            </h1>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <CloudBubble><strong>All season protection from £30</strong></CloudBubble>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Milton Keynes Ceramic Coating · All rights reserved
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <svg width="28" height="20" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg" aria-label="UK flag">
      <rect width="60" height="36" rx="2" fill="#012169"/>
      <path d="M0 0 L60 36 M60 0 L0 36" stroke="#ffffff" strokeWidth="6"/>
      <path d="M0 0 L60 36 M60 0 L0 36" stroke="#C8102E" strokeWidth="3"/>
      <rect x="0" y="15" width="60" height="6" fill="#ffffff"/>
      <rect x="27" y="0" width="6" height="36" fill="#ffffff"/>
      <rect x="0" y="16" width="60" height="4" fill="#C8102E"/>
      <rect x="28" y="0" width="4" height="36" fill="#C8102E"/>
    </svg>
  );
}

// Fixed: Sparkle component had an incomplete JSX block previously.
function Sparkle({ x = "50%", y = "50%", size = 20, delay = 0 }) {
  return (
    <motion.svg
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0.9, 1], rotate: [0, 45, 0], opacity: [0, 1, 1] }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <path d="M12 0l2.5 5L20 7.5 14.5 10 12 16l-2.5-6L4 7.5 9.5 5 12 0z" fill="white" fillOpacity="0.95"/>
    </motion.svg>
  );
}

function ShimmerText({ children }) {
  return (
    <motion.span
      aria-label={typeof children === 'string' ? children : undefined}
      initial={false}
      animate={{ backgroundPositionX: ['0%', '200%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      style={{
        backgroundImage:
          'linear-gradient(110deg, #f8e7a1 0%, #d4af37 20%, #fff4c2 35%, #b8860b 50%, #fff4c2 65%, #d4af37 80%, #f8e7a1 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}

function CloudBubble({ children }) {
  // Iridescent bubble-style border, no internal bubbles
  return (
    <div className="relative inline-block">
      <div
        className="relative px-6 py-3 rounded-full font-bold shadow-xl"
        style={{
          color: '#eaf6ff',
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(to right, rgba(2,6,23,0.55), rgba(2,6,23,0.55)),' +
            'conic-gradient(from 0deg, rgba(59,130,246,0.9), rgba(56,189,248,0.9), rgba(99,102,241,0.9), rgba(236,72,153,0.9), rgba(59,130,246,0.9))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 10px 25px rgba(3, 105, 161, 0.35), inset 0 0 18px rgba(255,255,255,0.08)',
          backdropFilter: 'blur(3px) saturate(120%)',
          WebkitBackdropFilter: 'blur(3px) saturate(120%)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

