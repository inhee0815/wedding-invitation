
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
    stiffness: 150,
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
  const photoScale = useTransform(smoothProgress, [0, 0.5], [0.95, 1.01]);
  const photoY = useTransform(smoothProgress, [0, 0.45], ["13%", "0%"]);

  // 4. Overlay Text (Inside Photo)
  const overlayOpacity = useTransform(smoothProgress, [0.6, 0.85], [0, 1]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.7 && !hasOpened) {
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
    <div ref={containerRef} className="h-[110dvh] relative w-full bg-paper">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">

        {/* --- Background: 사진 레이어 (크기 고정) --- */}
        <div
          style={{
            // 이제 변하는 값(scale, y) 없이 고정된 스타일만 부여합니다.
            zIndex: 10,
            willChange: "auto", // 애니메이션이 없으므로 auto로 설정해 메모리 절약
          }}
          className="absolute inset-0 w-full overflow-hidden bg-stone-200"
        >
          <img
            src="images/gallery10.jpg"
            alt="Wedding Couple"
            className="w-full object-cover"
            fetchPriority="high"
          // 인앱 브라우저 최적화: 이미지 자체에 불필요한 motion이나 연산 제거
          />
        </div>

        {/* --- Initial Floating Text (사진 위에 떠 있는 텍스트) --- */}
        <div
          style={{ opacity: textOpacity }}
          className="absolute top-0 w-full h-[35%] z-20 flex flex-col items-center justify-center pt-8 pointer-events-none text-white"
        // 배경 사진 위에서 잘 보이도록 글자색이나 drop-shadow를 고려해보세요
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
