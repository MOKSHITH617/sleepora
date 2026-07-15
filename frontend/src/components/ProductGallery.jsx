import React, { useState, useRef } from 'react';

const ProductGallery = ({ images = [], productName = 'Product', labels = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const touchStartX = useRef(null);

  // Ensure we have a valid list of images
  const displayImages = images.length > 0 ? images : ['/images/ortho_mattress.png'];

  const handleSelect = (index) => {
    if (index === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsFading(false);
    }, 150);
  };

  // Touch Swipe Handlers for Mobile Carousel
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 40;

    if (diff > threshold) {
      // Swipe left -> next image
      handleSelect((currentIndex + 1) % displayImages.length);
    } else if (diff < -threshold) {
      // Swipe right -> prev image
      handleSelect((currentIndex - 1 + displayImages.length) % displayImages.length);
    }
    touchStartX.current = null;
  };

  const currentLabel = labels[currentIndex] || `View ${currentIndex + 1}`;

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* ==========================================
          DESKTOP & MOBILE FEATURED / CAROUSEL VIEW
          ========================================== */}
      <div 
        className="relative pt-[68%] bg-[#FFFDFC] border border-[#E0D8CE]/60 shadow-md rounded-2xl overflow-hidden group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={displayImages[currentIndex]} 
          alt={`${productName} - ${currentLabel}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
            isFading ? 'opacity-20 scale-98' : 'opacity-100 scale-100'
          }`}
        />

        {/* Zoom/Expand Icon */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md cursor-pointer transition-colors">
          <svg className="w-4 h-4 text-[#201712]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>

        {/* View Label Badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#201712]/90 backdrop-blur-sm text-[#FFFDFC] text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B6844]"></span>
          <span>{currentLabel}</span>
        </div>

        {/* Mobile / Hover Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => handleSelect((currentIndex - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDFC]/90 hover:bg-[#FFFDFC] text-[#201712] shadow-md flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={() => handleSelect((currentIndex + 1) % displayImages.length)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDFC]/90 hover:bg-[#FFFDFC] text-[#201712] shadow-md flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Next image"
            >
              &#8594;
            </button>
          </>
        )}
      </div>

      {/* ==========================================
          MOBILE PAGINATION DOTS (<768px)
          ========================================== */}
      {displayImages.length > 1 && (
        <div className="flex md:hidden justify-center items-center gap-2 pt-1">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`transition-all duration-300 h-2 rounded-full focus:outline-none ${
                idx === currentIndex ? 'w-6 bg-[#8B6844]' : 'w-2 bg-[#E0D8CE]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* ==========================================
          DESKTOP THUMBNAIL ROW (>=768px)
          ========================================== */}
      {displayImages.length > 1 && (
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => handleSelect((currentIndex - 1 + displayImages.length) % displayImages.length)}
            className="w-9 h-9 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 rounded-xl bg-[#FFFDFC] text-[#201712] hover:bg-[#F4F1EC] flex items-center justify-center font-bold text-xs shadow-xs transition-colors focus:outline-none flex-shrink-0"
            aria-label="Previous thumbnail"
          >
            &#8592;
          </button>
          
          <div className="grid grid-cols-6 gap-2.5 flex-grow">
            {displayImages.map((img, idx) => {
              const isSelected = idx === currentIndex;
              const thumbLabel = labels[idx] || `View ${idx + 1}`;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`relative group border rounded-xl overflow-hidden bg-[#F4F1EC] transition-all aspect-[4/3] focus:outline-none flex flex-col justify-end ${
                    isSelected 
                      ? 'border-[#8B6844] ring-2 ring-[#8B6844]/30 shadow-sm' 
                      : 'border-[#E0D8CE]/60 hover:border-[#8B6844]/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 pt-3 text-[8.5px] font-medium text-white truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {thumbLabel}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleSelect((currentIndex + 1) % displayImages.length)}
            className="w-9 h-9 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 rounded-xl bg-[#FFFDFC] text-[#201712] hover:bg-[#F4F1EC] flex items-center justify-center font-bold text-xs shadow-xs transition-colors focus:outline-none flex-shrink-0"
            aria-label="Next thumbnail"
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
