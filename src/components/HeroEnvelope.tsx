import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [fixedHeight, setFixedHeight] = useState<string>('85vh'); // 초기값

  // [핵심] 인앱 브라우저의 가변 높이를 고정된 픽셀값으로 변경
  useEffect(() => {
    const vh = window.innerHeight * 0.95;
    setFixedHeight(`${vh}px`); // 85dvh에 해당하는 값을 픽셀로 고정
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001
  });

  // 텍스트 투명도 조절
  const textOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // 컨페티 트리거
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      // 스크롤 영역이 짧으므로 트리거 지점을 0.4 정도로 낮춤
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
        origin: { x: 0, y: 0.7 }, // y 좌표를 약간 올려서 하단바에 안 가려지게 함
        colors: ['#ffffff', '#a6eaa6'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffffff', '#a6eaa6'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    // 1. 전체 컨테이너의 스크롤 공간을 픽셀 기반으로 여유있게 설정
    <div
      ref={containerRef}
      style={{ height: `calc(${fixedHeight} * 1.1)` }}
      className="relative w-full bg-paper"
    >
      <div
        style={{ height: fixedHeight }} // 2. sticky 박스의 높이를 고정된 픽셀로 설정
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
      >
        {/* --- Background: 사진 레이어 --- */}
        <div className="absolute inset-0 w-full h-full z-10 bg-stone-200">
          <img
            src="images/gallery10.jpg"
            alt="Wedding Couple"
            // 3. h-full을 주되 부모(fixedHeight)가 고정이므로 더 이상 커지지 않음
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* --- Initial Floating Text --- */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[12dvh] pointer-events-none"
        >
          <p className="font-hand text-xs text-wood-900 tracking-[0.3em] mb-3 uppercase">the new beginning</p>
          <h1 className="font-hand text-3xl text-wood-900 drop-shadow-md">
            이종호 <span className="text-xl mx-1">&</span> 김인희
          </h1>
          <p className="mt-4 text-[10px] font-sans text-wood-900 tracking-[0.2em]">2026.04.26 SUN 13:40</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroEnvelope;