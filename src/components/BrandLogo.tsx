import React from 'react';
import { ThemeMode } from '../data/barbershopData';

interface BrandLogoProps {
  size?: 'default' | 'lg';
  theme?: ThemeMode;
  className?: string;
  href?: string;
}

/** Official Joie Salon brand identity: minimalist monogram + typography. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'default',
  theme = 'dark',
  className = '',
  href = '#top',
}) => {
  const isLarge = size === 'lg';
  const isLight = theme === 'light';
  const imgClass = `block shrink-0 object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
    isLarge ? 'h-9 sm:h-10 w-auto' : 'h-5.5 sm:h-6 md:h-6.5 w-auto'
  }`;
  const imgWidth = isLarge ? 240 : 146;
  const imgHeight = isLarge ? 42 : 26;

  return (
    <a
      href={href}
      aria-label={href === '#top' ? 'Joie Salon — Back to top' : 'Joie Salon home'}
      className={`group inline-flex items-center shrink-0 select-none focus-ring ${className}`}
    >
      <picture className="inline-flex items-center">
        {isLight ? (
          <>
            <source srcSet="/assets/brand/joie-salon-logo.webp" type="image/webp" />
            <img
              src="/assets/brand/joie-salon-logo.png"
              alt="Joie Salon"
              width={imgWidth}
              height={imgHeight}
              decoding="async"
              className={imgClass}
            />
          </>
        ) : (
          <>
            <source srcSet="/assets/brand/joie-salon-logo-white.webp" type="image/webp" />
            <img
              src="/assets/brand/joie-salon-logo-white.png"
              alt="Joie Salon"
              width={imgWidth}
              height={imgHeight}
              decoding="async"
              className={imgClass}
            />
          </>
        )}
      </picture>
    </a>
  );
};
