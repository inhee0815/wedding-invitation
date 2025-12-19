import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface HeroEnvelopeProps {
  onOpened: () => void;
}

const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ onOpened }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/bgm/main.mp3"); // 클릭 시점에 생성
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };


  // 1. 스크롤 진행도 설정
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. 더 부드러운 관성을 위해 spring 설정 조정 (GSAP의 scrub 느낌)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  // ------------------------------------------------------------------
  // Animation Mappings
  // ------------------------------------------------------------------
  // 텍스트 페이드 및 위로 이동
  const textOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.15], [0, -30]);

  // 봉투 앞면 (Pocket) - 단순 Y축 이동
  const envelopeY = useTransform(smoothProgress, [0.1, 0.4], ["0%", "100%"]);
  const envelopeOpacity = useTransform(smoothProgress, [0.35, 0.5], [1, 0]);

  // 사진 확장 - Width/Height 대신 Scale과 ClipPath 사용
  // 0.85 scale에서 1.0으로 부드럽게 확장
  const photoScale = useTransform(smoothProgress, [0, 0.9], [0.85, 1]);
  // borderRadius 애니메이션은 성능 저하의 주범이므로 clipPath로 대체하거나 고정 권장
  const photoClip = useTransform(
    smoothProgress,
    [0.8, 1],
    ["inset(5% 5% 5% 5% round 12px)", "inset(0% 0% 0% 0% round 0px)"]
  );

  const overlayOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.8 && !hasOpened) {
        setHasOpened(true);
        onOpened();
        fireConfetti();
      }
    });
    return () => unsubscribe();
  }, [hasOpened, smoothProgress, onOpened]);

  // // 1. Text Fades Out
  // const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  // const textY = useTransform(smoothProgress, [0, 0.2], [0, -50]);

  // // 2. Envelope Front moves DOWN and fades
  // const envelopeY = useTransform(smoothProgress, [0.1, 0.4], ["0%", "100%"]);
  // const envelopeOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);

  // // 3. Photo Expansion
  // // Mapped to [0, 1] so it completes exactly when the scroll container ends
  // const photoWidth = useTransform(smoothProgress, [0, 1], ["85%", "100%"]);
  // const photoHeight = useTransform(smoothProgress, [0, 1], ["80%", "100%"]);
  // const photoY = useTransform(smoothProgress, [0, 1], ["5%", "0%"]);
  // const photoScale = useTransform(smoothProgress, [0, 1], [0.95, 1]);
  // const photoRadius = useTransform(smoothProgress, [0.8, 1], ["12px", "0px"]);

  // // 4. Final Text Overlay
  // const overlayOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);

  // useEffect(() => {
  //   // Trigger confetti when opened sufficiently
  //   const unsubscribe = smoothProgress.on("change", (latest) => {
  //     if (latest > 0.8 && !hasOpened) {
  //       setHasOpened(true);
  //       onOpened();
  //       fireConfetti();
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [hasOpened, smoothProgress, onOpened]);

  const fireConfetti = async () => {
    // 함수 호출 시점에 라이브러리를 동적으로 불러옵니다.
    const { default: confetti } = await import('canvas-confetti');

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

        {/* --- Layer 1: Photo (Scale 기반 최적화) --- */}
        <motion.div
          style={{
            scale: photoScale,
            clipPath: photoClip,
            willChange: "transform, clip-path" // GPU 가속 힌트
          }}
          className="absolute z-10 w-full h-full max-w-[90%] max-h-[80%] overflow-hidden shadow-2xl bg-gray-200"
        >
          <img
            src="images/main1.jpg" // WebP 권장
            alt="Wedding Couple"
            className="w-full h-full object-cover"
            fetchpriority="high" // 우선순위 상향
            loading="eager"
            decoding="async"
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