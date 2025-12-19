
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const photos: Photo[] = [
  { id: 1, url: 'images/together1.jpg', alt: 'Wedding 1' },
  { id: 2, url: 'images/gallery18.webp', alt: 'Wedding 2' },
  { id: 3, url: 'images/together2.jpg', alt: 'Wedding 3' },
  { id: 4, url: 'images/inhee1.jpg', alt: 'Wedding 4' },
  { id: 5, url: 'images/gallery11.webp', alt: 'Wedding 5' },
  { id: 6, url: 'images/gallery3.webp', alt: 'Wedding 6' },
  { id: 7, url: 'images/together3.jpg', alt: 'Wedding 7' },
  { id: 8, url: 'images/inhee2.jpg', alt: 'Wedding 8' },
  { id: 9, url: 'images/together5.jpg', alt: 'Wedding 9' },
];

// Helper Component for Individual Lightbox Image
// Manages its own loading state to prevent global flicker
const LightboxImage: React.FC<{
  photo: Photo;
  onNext: () => void;
  onPrev: () => void;
}> = ({ photo, onNext, onPrev }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      key={photo.id}
      className="w-full h-full flex items-center justify-center relative"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset }) => {
        const swipe = offset.x;
        if (swipe < -50) {
          onNext();
        } else if (swipe > 50) {
          onPrev();
        }
      }}
    >
      {/* Local Spinner - Only shows for this specific image if not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 z-0">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      <img
        src={photo.url}
        alt={photo.alt}
        className={`max-w-full max-h-full object-contain select-none pointer-events-none transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Preload images for better performance
  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      // Preload next and prev images
      const nextIndex = selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0;
      const prevIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1;

      preloadImage(photos[nextIndex].url);
      preloadImage(photos[prevIndex].url);
    }
  }, [selectedPhotoIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  }, [selectedPhotoIndex]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  }, [selectedPhotoIndex]);

  const closeLightbox = () => setSelectedPhotoIndex(null);

  return (
    <section className="py-16 bg-white">
      <div className="px-6 mb-8 text-center">
        <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">GALLERY</span>
        <p className="mt-4 text-stone-500 text-xs">순간의 기록들</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <img
              src={photo.url}
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: '1 / 1' }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onContextMenu={(e) => e.preventDefault()}
            />
          </motion.div>
        ))}
      </div>

      {/* Full Screen Lightbox */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center touch-none"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 z-50"
            >
              <X size={32} />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-50 hidden sm:block"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-50 hidden sm:block"
            >
              <ChevronRight size={40} />
            </button>

            {/* Main Image Container */}
            <div className="w-full h-full flex items-center justify-center p-0 sm:p-4 overflow-hidden relative">
              <LightboxImage
                photo={photos[selectedPhotoIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </div>

            {/* Indicator */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-sm font-light">
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;