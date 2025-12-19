import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current = new Audio("/bgm/main.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };


  // Reduced height to 150vh to make the text appear immediately after the "opening"
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Stiffer spring for closer tracking to scroll position
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 25 });

  // ------------------------------------------------------------------
  // Animation Mappings
  // ------------------------------------------------------------------

  // 1. Text Fades Out
  const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.2], [0, -50]);

  // 2. Envelope Front moves DOWN and fades
  const envelopeY = useTransform(smoothProgress, [0.1, 0.4], ["0%", "100%"]);
  const envelopeOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);

  // 3. Photo Expansion
  // Mapped to [0, 1] so it completes exactly when the scroll container ends
  const photoWidth = useTransform(smoothProgress, [0, 1], ["85%", "100%"]);
  const photoHeight = useTransform(smoothProgress, [0, 1], ["80%", "100%"]);
  const photoY = useTransform(smoothProgress, [0, 1], ["5%", "0%"]);
  const photoScale = useTransform(smoothProgress, [0, 1], [0.95, 1]);
  const photoRadius = useTransform(smoothProgress, [0.8, 1], ["12px", "0px"]);

  // 4. Final Text Overlay
  const overlayOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);

  useEffect(() => {
    // Trigger confetti when opened sufficiently
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.8 && !hasOpened) {
        setHasOpened(true);
        onOpened();
        fireConfetti();
      }
    });
    return () => unsubscribe();
  }, [hasOpened, smoothProgress, onOpened]);

  const fireConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ffffff', '#ffe4e1', '#f0f8ff'],
        drift: 0.5
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffffff', '#ffe4e1', '#f0f8ff'],
        drift: -0.5
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div ref={containerRef} className="h-[120vh] relative w-full bg-paper">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">

        {/* --- Layer 1: The Photo --- */}
        <motion.div
          style={{
            width: photoWidth,
            height: photoHeight,
            y: photoY,
            scale: photoScale,
            borderRadius: photoRadius
          }}
          className="absolute z-10 overflow-hidden shadow-2xl origin-center bg-gray-200"
        >
          <img
            src="images/main1.jpg"
            alt="Wedding Couple"
            className="w-full h-full object-cover"
          />

          {/* Dark gradient overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end pb-24 text-white text-center"
          >
            <h2 className="font-serif text-4xl mb-2 drop-shadow-md">Jongho & Inhee</h2>
            <p className="font-sans text-sm tracking-[0.2em] opacity-90 drop-shadow-md">2026.04.26 SUN</p>
          </motion.div>
        </motion.div>


        {/* --- Layer 2: Top Text (Initial State) --- */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute top-0 w-full h-[40%] z-20 flex flex-col items-center justify-center pt-10"
        >
          <p className="font-serif text-wood-800 text-sm tracking-widest mt-2 mb-2">Wedding Invitation</p>
          <h1 className="font-hand text-2xl text-wood-900">
            이종호 <span className="text-sm mx-1">&</span> 김인희
          </h1>
          <p className="mt-4 text-xs text-wood-400 font-sans">2026.04.26.SUN</p>
        </motion.div>


        {/* --- Layer 3: The Envelope Front (Pocket) --- */}
        <motion.div
          style={{ y: envelopeY, opacity: envelopeOpacity }}
          className="absolute bottom-0 w-full h-[40%] z-30 pointer-events-none"
        >
          {/* V-Shape SVG mask */}
          <div className="w-full h-full relative">
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              className="absolute bottom-0 w-full h-full drop-shadow-[0_-10px_20px_rgba(0,0,0,0.1)] text-paper"
            >
              <path d="M0,0 L200,100 L400,0 L400,300 L0,300 Z" fill="currentColor" />
            </svg>

            {/* Decorative Scroll Hint */}
            <div className="absolute bottom-12 w-full text-center flex flex-col items-center justify-end pb-8">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-wood-300"
              >
                <ChevronDown size={24} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroEnvelope;