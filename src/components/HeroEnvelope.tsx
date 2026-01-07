import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fixedHeight, setFixedHeight] = useState('85vh');

  // 실제 기기 높이를 고정 (인앱 렉 방지)
  useEffect(() => {
    const vh = window.innerHeight * 0.85;
    setFixedHeight(`${vh}px`);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
  });

  // 텍스트 투명도 조절
  const textOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // 스크롤이 일정 수준(70%)을 넘었을 때 부모 컴포넌트에 알림 (컨페티 없이 함수만 실행)
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.7) {
        onOpened(); // 메인 페이지의 다른 요소들을 보여주기 위한 콜백
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, onOpened]);

  return (
    <div
      ref={containerRef}
      style={{ height: `calc(${fixedHeight} * 1.2)` }}
      className="relative w-full bg-paper"
    >
      <div
        style={{ height: fixedHeight }}
        className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center"
      >
        {/* --- Background: 사진 레이어 --- */}
        <div className="absolute inset-0 w-full h-full z-10 bg-stone-200">
          <img
            src="images/gallery10.jpg"
            alt="Wedding Couple"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* --- Initial Floating Text --- */}
        <motion.div
          style={{ opacity: textOpacity }}
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