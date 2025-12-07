import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getLikes, toggleLike, checkHasLiked } from '../services/storage';

const LikeSection: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showParticle, setShowParticle] = useState(false);

  useEffect(() => {
    setLikes(getLikes());
    setIsLiked(checkHasLiked());
  }, []);

  const handleLike = () => {
    const result = toggleLike();
    setLikes(result.count);
    setIsLiked(result.liked);
    
    if (result.liked) {
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
    }
  };

  return (
    <div className="py-12 bg-white flex flex-col items-center justify-center border-t border-b border-stone-100">
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className={`relative z-10 p-4 rounded-full transition-colors duration-300 ${isLiked ? 'bg-red-50' : 'bg-gray-50'}`}
        >
          <Heart 
            size={32} 
            className={`transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </motion.button>

        {/* Floating particles effect on click */}
        <AnimatePresence>
          {showParticle && (
             <>
               {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                   animate={{ 
                     opacity: 0, 
                     scale: 1, 
                     x: Math.cos(i * 60 * (Math.PI / 180)) * 40, 
                     y: Math.sin(i * 60 * (Math.PI / 180)) * 40 
                   }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.6 }}
                   className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                 />
               ))}
             </>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-stone-500 font-serif">
        <span className="font-bold text-wood-800">{likes}</span>명이 축하해 주셨습니다
      </p>
    </div>
  );
};

export default LikeSection;