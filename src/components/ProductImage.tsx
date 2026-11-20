import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  imgClassName?: string;
}

export function ProductImage({
  src,
  alt,
  title,
  className = '',
  imgClassName = '',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#EFEADF] via-[#F7F4EC] to-[#E2DACB] text-[#132A1E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex h-12 w-12 items-center justify-center border border-[#B88A3E]/40 text-[#966D28] mb-3">
          <Sprout className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-serif text-lg font-medium tracking-tight text-[#132A1E]">
          {title || 'Zestora Hills'}
        </span>
        <span className="mt-1 text-xs text-[#4A5D52]">Western Ghats Single-Origin</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EFEADF] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition-transform duration-300 ease-out ${imgClassName}`}
      />
    </div>
  );
}
