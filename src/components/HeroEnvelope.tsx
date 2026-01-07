import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [fixedHeight, setFixedHeight] = useState('85vh');

  // 1. 인앱 브라우저 주소창 변화에 따른 렉 방지 (높이 픽셀 고정)
  useEffect(() => {
    const vh = window.innerHeight * 0.85;
    setFixedHeight(`${vh}px`);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
  });

  // 3. 컨페티 로직 (유지)
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.4 && !hasOpened) {
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
      style={{ height: `calc(${fixedHeight} * 1.05)` }} // 스크롤 여유 공간
      className="relative w-full bg-paper"
    >
      <div
        style={{ height: fixedHeight }}
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
      >
        {/* --- Background: 사진 레이어 (이제 절대 늘어나지 않음) --- */}
        <div className="absolute inset-0 w-full h-full z-10 bg-stone-200">
          <img
            src="images/gallery10.jpg"
            alt="Wedding Couple"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* --- Initial Floating Text (하드웨어 가속 적용) --- */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[12dvh] pointer-events-none"
        >
          <p className="font-hand text-xs text-wood-900 tracking-[0.3em] mb-3 uppercase">the new beginning</p>
          <h1 className="font-hand text-3xl text-wood-900 drop-shadow-md">
            이종호 <span className="text-xl mx-1">&</span> 김인희
          </h1>
          <p className="mt-4 text-[10px] font-sans text-wood-900 tracking-[0.2em]">2026.04.26 SUN 13:40</p>
        </div>
      </div>
    </div>
  );
};

export default HeroEnvelope;