import React from 'react';
import { motion } from 'framer-motion';
import { Photo } from '../types';

const photos: Photo[] = [
  { id: 1, url: 'images/together1.jpg', alt: 'Wedding 1' },
  { id: 2, url: 'images/jongho1.jpg', alt: 'Wedding 2' },
  { id: 3, url: 'images/together2.jpg', alt: 'Wedding 3' },
  { id: 4, url: 'images/inhee1.jpg', alt: 'Wedding 4' },
  { id: 5, url: 'images/inhee2.jpg', alt: 'Wedding 5' },
  { id: 6, url: 'images/jongho2.jpg', alt: 'Wedding 6' },
  { id: 7, url: 'images/together3.jpg', alt: 'Wedding 7' },
  { id: 8, url: 'images/together4.jpg', alt: 'Wedding 8' },
];

const Gallery: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-6 mb-6">
        <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">GALLERY</span>
        <p className="mt-2 text-stone-400 text-xs">Swipe to see more</p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x snap-mandatory">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-shrink-0 w-[80%] max-w-[300px] snap-center"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-md shadow-md bg-gray-100">
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
        {/* Spacer for right padding */}
        <div className="w-2 flex-shrink-0"></div>
      </div>
    </section>
  );
};

export default Gallery;