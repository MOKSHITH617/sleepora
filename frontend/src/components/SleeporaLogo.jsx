import React from 'react';

const SleeporaLogo = ({ 
  variant = 'dark', 
  simplified = false, 
  iconOnly = false,
  height = '50px',
  className = '',
  subtitle = '',
  vertical = false
}) => {
  const isLight = variant === 'light';
  
  // Colors matching the brand identity
  const iconColor = '#8B6844'; // Luxury Gold/Brown
  const textColor = isLight ? '#FFFDFC' : '#2E221A'; // Light cream vs Dark coffee
  
  // Cloud Bed Icon SVG paths
  const renderIcon = (size = 40) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="15 12 110 76" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform duration-300 group-hover:scale-103"
    >
      {/* Cloud Top Outline (Open at bottom) */}
      <path 
        d="M 45 76 
           C 25 76, 20 48, 42 43 
           C 42 16, 95 16, 98 38 
           C 118 38, 126 62, 108 76" 
        stroke={iconColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Bed Mattress Wave Line */}
      <path 
        d="M 42 76 
           C 52 81, 72 81, 82 76 
           C 92 71, 102 76, 108 76" 
        stroke={iconColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none"
      />

      {/* Headboard */}
      <path 
        d="M 106 76 L 106 64" 
        stroke={iconColor} 
        strokeWidth="3" 
        strokeLinecap="round"
      />

      {/* Pillow */}
      <path 
        d="M 94 72 
           C 94 65, 103 65, 103 72 
           C 103 76, 94 76, 94 72 Z" 
        fill={iconColor}
      />

      {/* 4-Pointed Sparkle Stars */}
      {/* Sparkle 1 (Large Center) */}
      <path 
        d="M 72 26 Q 72 31 77 31 Q 72 31 72 36 Q 72 31 67 31 Q 72 31 72 26 Z" 
        fill={iconColor}
      />
      {/* Sparkle 2 (Medium Left) */}
      <path 
        d="M 60 38 Q 60 41 63 41 Q 60 41 60 44 Q 60 41 57 41 Q 60 41 60 38 Z" 
        fill={iconColor}
      />
      {/* Sparkle 3 (Small Right) */}
      <path 
        d="M 84 36 Q 84 38 86 38 Q 84 38 84 40 Q 84 38 82 38 Q 84 38 84 36 Z" 
        fill={iconColor}
      />
    </svg>
  );

  if (iconOnly) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        {renderIcon(parseInt(height) || 40)}
      </div>
    );
  }

  return (
    <div 
      className={`flex select-none transition-opacity duration-300 ${className} group ${
        vertical 
          ? 'flex-col items-center justify-center text-center gap-3' 
          : 'items-center gap-3.5'
      }`}
      style={vertical ? {} : { height }}
    >
      {/* Cloud Bed Icon */}
      {renderIcon(vertical ? 56 : parseInt(height) * 0.95)}

      {/* Text Branding */}
      <div className={`flex flex-col justify-center ${vertical ? 'items-center text-center' : 'items-start text-left'}`}>
        {/* Wordmark */}
        <span 
          className="font-serif tracking-[2px] leading-none uppercase select-none font-bold"
          style={{ 
            color: textColor,
            fontSize: simplified ? '20px' : '23px',
            fontFamily: "'Cormorant Garamond', serif"
          }}
        >
          Sleepora
        </span>

        {/* Separator & Tagline (if not simplified) */}
        {!simplified && (
          <div className={`flex flex-col mt-1.5 w-full ${vertical ? 'items-center' : 'items-start'}`}>
            {/* Minimal Gold Separator with Center Ornament */}
            <div className="flex items-center w-[125px] h-[3px] relative my-0.5 mx-auto">
              <div className="flex-grow h-[1px]" style={{ backgroundColor: `${iconColor}50` }}></div>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mx-1">
                <path d="M5 0 C6 2 9 3 9 5 C9 6 8 6 5 4 C2 6 1 6 1 5 C1 3 4 2 5 0 Z" fill={iconColor} />
              </svg>
              <div className="flex-grow h-[1px]" style={{ backgroundColor: `${iconColor}50` }}></div>
            </div>
            {/* Tagline */}
            <span 
              className="text-[7.5px] font-sans font-bold tracking-[2.5px] uppercase select-none leading-none mt-1"
              style={{ color: isLight ? `${textColor}BB` : '#6D6258' }}
            >
              {subtitle || "Perfect Sleep, Perfect Life"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleeporaLogo;
