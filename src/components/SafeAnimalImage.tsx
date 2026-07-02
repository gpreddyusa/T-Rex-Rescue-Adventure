import React, { useState, useEffect } from "react";

interface SafeAnimalImageProps {
  src: string;
  alt: string;
  emoji: string;
  className?: string;
  fallbackClassName?: string;
  fallbackElement?: React.ReactNode;
}

export function SafeAnimalImage({
  src,
  alt,
  emoji,
  className = "w-16 h-16 rounded-full object-cover shadow-sm",
  fallbackClassName,
  fallbackElement,
}: SafeAnimalImageProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (imgError || !src) {
    if (fallbackElement) {
      return <div className={fallbackClassName || className}>{fallbackElement}</div>;
    }
    // Elegant soft gradient background based on the emoji
    return (
      <div 
        className={`${fallbackClassName || className} bg-gradient-to-tr from-emerald-100 to-sky-100 border border-emerald-200/50 flex items-center justify-center select-none`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span className="scale-125">{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        console.warn(`SafeAnimalImage failed to load: ${alt}. Falling back to emoji: ${emoji}`);
        setImgError(true);
      }}
      className={className}
    />
  );
}
