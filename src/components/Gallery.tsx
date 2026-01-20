
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// 사진 데이터 정의 (thumbnailPosition을 통해 각 사진의 썸네일 노출 위치를 미세하게 조정 가능)
const photos: Photo[] = [
  { id: 1, url: 'images/gallery1.jpg', alt: 'Wedding Photo 1', thumbnailPosition: 'center 70%' },
  { id: 2, url: 'images/gallery2.jpg', alt: 'Wedding Photo 2', thumbnailPosition: 'center 60%' },
  { id: 3, url: 'images/gallery3.jpg', alt: 'Wedding Photo 3', thumbnailPosition: 'center 5%' },
  { id: 4, url: 'images/gallery4.jpg', alt: 'Wedding Photo 4', thumbnailPosition: 'center 5%' },
  { id: 5, url: 'images/gallery5.jpg', alt: 'Wedding Photo 5', thumbnailPosition: 'center 5%' },
  { id: 6, url: 'images/gallery6.jpg', alt: 'Wedding Photo 6', thumbnailPosition: 'center 10%' },
  { id: 7, url: 'images/gallery7.jpg', alt: 'Wedding Photo 7', thumbnailPosition: 'center center' },
  { id: 8, url: 'images/gallery8.jpg', alt: 'Wedding Photo 8', thumbnailPosition: 'center center' },
  { id: 9, url: 'images/gallery9.jpg', alt: 'Wedding Photo 9', thumbnailPosition: 'center center' },
  { id: 10, url: 'images/gallery10.jpg', alt: 'Wedding Photo 10', thumbnailPosition: 'center 40%' },
  { id: 11, url: 'images/gallery11.jpg', alt: 'Wedding Photo 11', thumbnailPosition: 'center 40%' },
  { id: 12, url: 'images/gallery12.jpg', alt: 'Wedding Photo 12', thumbnailPosition: 'center 65%' },
  { id: 13, url: 'images/gallery13.jpg', alt: 'Wedding Photo 13', thumbnailPosition: 'center center' },
  { id: 14, url: 'images/gallery14.jpg', alt: 'Wedding Photo 14', thumbnailPosition: 'center 15%' },
  { id: 15, url: 'images/gallery15.jpg', alt: 'Wedding Photo 15', thumbnailPosition: 'center 20%' },
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
        style={{
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
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
        <span className="text-wood-800 text-sm tracking-widest font-cinzel font-medium border-b border-wood-300 pb-1">GALLERY</span>
        <p className="mt-4 text-stone-500 font-gothic text-xs">순간의 기록들</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="aspect-square bg-stone-100 overflow-hidden cursor-pointer relative"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              draggable="false"
              style={{
                aspectRatio: '1 / 1',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                // 각 사진마다 지정된 thumbnailPosition 적용, 없으면 기본값 center 20%
                objectPosition: photo.thumbnailPosition || 'center 20%'
              }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 pointer-events-auto"
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
            <div className="w-full h-full flex items-center justify-center p-0 sm:p-4 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}>
              <LightboxImage
                photo={photos[selectedPhotoIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </div>

            {/* Indicator */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-sm font-light" onClick={(e) => e.stopPropagation()}>
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;