
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Snappy spring for immediate feedback
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
    restDelta: 0.001
  });

  // ------------------------------------------------------------------
  // Animation Mappings - Snappy & High Performance
  // ------------------------------------------------------------------

  // 1. Initial Text (Header) - Positioned at the very top
  const textOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.1], [0, -50]); // Slightly more lift

  // 2. Envelope Front (The Pocket)
  const envelopeY = useTransform(smoothProgress, [0.05, 0.3], ["0%", "100%"]);
  const envelopeOpacity = useTransform(smoothProgress, [0.2, 0.35], [1, 0]);

  // 3. Photo Expansion - Starts even deeper (28%) to create clear space from text
  const photoScale = useTransform(smoothProgress, [0, 0.5], [0.8, 1.01]);
  const photoY = useTransform(smoothProgress, [0, 0.45], ["20%", "0%"]);
  const photoRadius = useTransform(smoothProgress, [0.4, 0.6], ["12px", "0px"]);

  // 4. Overlay Text (Inside Photo)
  const overlayOpacity = useTransform(smoothProgress, [0.6, 0.85], [0, 1]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.5 && !hasOpened) {
        setHasOpened(true);
        onOpened();
        fireConfetti();
      }
    });
    return () => unsubscribe();
  }, [hasOpened, smoothProgress, onOpened]);

  const fireConfetti = async () => {
    const { default: confetti } = await import('canvas-confetti');
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ffffffff', '#a6eaa6ff'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ffffff', '#a6eaa6ff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <div
      ref={containerRef}
      className="h-[125vh] relative w-full bg-paper touch-pan-y"
      style={{ isolation: 'isolate' }}
    >
      {/* 
        Optimization: Use 100vh (Dynamic Viewport Height) for the sticky container.
        This handles mobile address bars smoothly. 
      */}
      <div className="sticky top-0 h-[100vh] min-h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center translate-z-0">

        {/* --- Background --- */}
        <div className="absolute inset-0 bg-stone-100 z-0 transform-gpu" style={{ transform: 'translateZ(0)' }} />

        {/* --- Layer 1: Initial Floating Text --- */}
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            translateZ: 0
          }}
          className="absolute top-0 w-full h-[35%] z-20 flex flex-col items-center justify-center pt-12 pointer-events-none transform-gpu"
        >
          <p className="font-hand text-wood-900 text-xs tracking-[0.3em] mb-3 uppercase">the new beginning</p>
          <h1 className="font-hand text-3xl text-wood-900 drop-shadow-sm">
            이종호 <span className="text-xl mx-1 text-wood-900">&</span> 김인희
          </h1>
          <p className="mt-4 text-[10px] text-wood-400 font-sans tracking-[0.2em]">2026.04.26 SUN 13:50</p>
        </motion.div>


        {/* --- Layer 2: The Photo --- */}
        <motion.div
          style={{
            scale: photoScale,
            y: photoY,
            borderRadius: photoRadius,
            translateZ: 0,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
          className="absolute z-10 w-full h-full overflow-hidden origin-center bg-stone-200 shadow-2xl transform-gpu"
        >
          <motion.img
            src="images/gallery10.jpg"
            alt="Wedding Couple"
            className="w-full h-full object-cover transform-gpu"
            fetchPriority="high"
            style={{
              willChange: "transform",
              transform: 'translateZ(0)'
            }}
          />

          {/* Overlay Text */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end pb-24 text-white text-center transform-gpu"
          >
            <h2 className="font-serif text-4xl mb-2 drop-shadow-lg">Jongho & Inhee</h2>
            <p className="font-sans text-sm tracking-[0.2em] opacity-90 drop-shadow-md">2026.04.26 SUN</p>
          </motion.div>
        </motion.div>


        {/* --- Layer 3: The Envelope Front (The Pocket) --- */}
        <motion.div
          style={{
            y: envelopeY,
            opacity: envelopeOpacity,
            translateZ: 0,
            willChange: "transform, opacity"
          }}
          className="absolute bottom-0 w-full h-[55vh] z-30 pointer-events-none transform-gpu"
        >
          <div className="w-full h-full relative">
            <img
              src="images/envelope.png"
              alt="봉투 앞면"
              className="absolute bottom-0 w-full h-auto drop-shadow-[0_-10px_20px_rgba(0,0,0,0.15)] scale-[1.02] transform-gpu"
              style={{ transform: 'translateZ(0)' }}
            />

            {/* Scroll Hint */}
            <div className="absolute bottom-12 w-full text-center flex flex-col items-center">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-wood-300 flex flex-col items-center gap-1 transform-gpu"
                style={{ transform: 'translateZ(0)' }}
              >
                <span className="text-[10px] tracking-widest font-sans opacity-60">OPEN</span>
                <ChevronDown size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroEnvelope;
