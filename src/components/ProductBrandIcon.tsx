import React from 'react';

interface BrandLogoProps {
  logo?: string | null;
  brandName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-6 w-6 rounded-md p-0.5', text: 'text-[9px]' },
  md: { box: 'h-12 w-12 rounded-xl p-1.5', text: 'text-sm' },
  lg: { box: 'h-14 w-14 rounded-2xl p-2', text: 'text-base' },
};

/** Always on a white tile, so dark logos stay visible in dark mode. */
export default function ProductBrandIcon({ logo, brandName, size = 'md', className = '' }: BrandLogoProps) {
  const { box, text } = SIZES[size];

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white ${box} ${className}`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" loading="lazy" className="h-full w-full object-contain" />
      ) : (
        <span className={`font-black uppercase text-gray-700 ${text}`} aria-hidden="true">
          {brandName.slice(0, 2)}
        </span>
      )}
    </span>
  );
}
