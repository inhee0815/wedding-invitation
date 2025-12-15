import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getLikes, incrementLike } from '../services/storage';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  scale: number;
}

const LikeSection: React.FC = () => {
  const [likes, setLikes] = useState(154);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Load initial likes
    getLikes().then(setLikes);
  }, []);

  const handleLike = async () => {
    // Optimistic UI Update
    setLikes(prev => prev + 1);

    // Add Particles - Increased count and spread
    const emojis = ['💚', '💚', '❤️', '❤️', '🤵', '👰', '🎉', '✨'];
    const newParticles: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      // Wide spread on X axis (-150px to 150px)
      x: (Math.random() - 0.5) * 300,
      // High spread on Y axis (mostly upwards, -300px to -50px)
      y: (Math.random() * -250) - 50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      // Random rotation (-360 to 360)
      rotation: (Math.random() - 0.5) * 720,
      // Random scale (0.8 to 2.5) for depth
      scale: 0.8 + Math.random() * 1.7,
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id > Date.now() - 1000));
    }, 1200);

    // Sync with DB
    await incrementLike();
  };

  return (
    // Removed overflow-hidden so particles can fly outside the section
    <div className="py-16 bg-white flex flex-col items-center justify-center relative z-10">
      <div className="text-center mb-8 relative z-10">
        <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">CELEBRATE</span>
        <p className="mt-4 text-stone-500 text-xs">두 사람의 앞날을 축복해주세요</p>
      </div>

      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className="relative z-20 w-24 h-24 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center shadow-lg transition-colors duration-200 group active:shadow-inner"
        >
          <Heart
            size={40}
            className="fill-red-500 text-red-500 transition-transform duration-200 group-hover:scale-110"
          />
        </motion.button>

        {/* Floating Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0], // Fade in then out
                scale: particle.scale,
                x: particle.x,
                y: particle.y,
                rotate: particle.rotation
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 text-3xl pointer-events-none select-none z-0"
              style={{ marginLeft: '-1rem', marginTop: '-1rem' }} // Center origin
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center relative z-10">
        <p className="text-3xl font-serif text-wood-900 font-bold tabular-nums">
          {likes.toLocaleString()}
        </p>
        <p className="text-stone-500 text-xs mt-2">분이 축하해주셨습니다</p>
      </div>
    </div>
  );
};

export default LikeSection;