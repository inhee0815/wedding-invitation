import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fixedHeight, setFixedHeight] = useState<string>('90vh'); // 초기값
  const [fixedPaddingTop, setFixedPaddingTop] = useState<string>('12vh'); // 텍스트 위치 고정용

  // [핵심] 인앱 브라우저의 가변 높이를 고정된 픽셀값으로 변경
  useEffect(() => {
    const vh = window.innerHeight * 0.9;
    setFixedHeight(`${vh}px`); // 85dvh에 해당하는 값을 픽셀로 고정
    setFixedPaddingTop(`${vh * 0.12}px`); // 12dvh를 px로 변환
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

  useEffect(() => {
    // 마운트 후 애니메이션 시작을 위한 짧은 지연
    const timer = setTimeout(() => {
      setIsLoaded(true);
      fireConfetti();
      onOpened();
    }, 500);
    return () => clearTimeout(timer);
  }, [onOpened]);

  const fireConfetti = async () => {
    const { default: confetti } = await import('canvas-confetti');

    const duration = 6 * 1000;
    const end = Date.now() + duration;

    // 위에서 은은하게 눈처럼 내리는 무지개빛 컨페티
    const frame = () => {
      confetti({
        particleCount: 5,
        startVelocity: 0,
        ticks: 300,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2 // 화면 상단 밖에서 시작
        },
        // 무지개빛 팔레트: 골드, 핑크, 블루, 퍼플, 피치 등
        colors: [
          '#FFD700', // Gold
          '#FF69B4', // Hot Pink
        ],
        shapes: ['circle'],
        gravity: 0.35, // 조금 더 천천히 떨어지게 조정
        scalar: Math.random() * 0.5 + 0.4, // 크기 다양화
        drift: Math.random() - 0.5,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    // 1. 전체 컨테이너의 스크롤 공간을 픽셀 기반으로 여유있게 설정
    <div
      ref={containerRef}
      style={{ height: `calc(${fixedHeight} * 1)` }}
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
          style={{
            opacity: textOpacity,
            paddingTop: fixedPaddingTop, // [핵심] dvh 대신 고정된 px 사용
            // GPU 가속을 강제하여 미세한 떨림 방지
            transform: "translateZ(0)",
            WebkitBackfaceVisibility: "hidden"
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pointer-events-none"
        >
          <p className="font-hand text-xs text-wood-900 tracking-[0.3em] mb-3 uppercase">the new beginning</p>
          <h1 className="font-hand text-3xl text-wood-900 drop-shadow-md">
            이종호 <span className="text-xl mx-1">&</span> 김인희
          </h1>
          <p className="mt-4 text-[10px] font-sans text-wood-900 tracking-[0.2em]">2026.04.26 SUN 13:40</p>
        </motion.div>
      </div>
      {/* 하단 스크롤 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-wood/60"
      >
        <span className="text-[8px] tracking-[0.4em] uppercase font-sans font-light">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </div >
  );
};

export default HeroEnvelope;