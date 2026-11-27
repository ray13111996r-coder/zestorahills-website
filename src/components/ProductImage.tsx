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
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#E9E2D3] via-[#F3EBDD] to-[#DDD2BF] text-[#173C2B] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex h-12 w-12 items-center justify-center border border-[#B69A61]/40 text-[#987B43] mb-3">
          <Sprout className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-serif text-lg font-medium tracking-tight text-[#173C2B]">
          {title || 'Zestora Hills'}
        </span>
        <span className="mt-1 text-xs text-[#52665A]">Western Ghats Single-Origin</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#E9E2D3] ${className}`}>
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
