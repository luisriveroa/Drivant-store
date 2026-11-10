import React from 'react';
import ProductBrandIcon from '@/components/ProductBrandIcon';

interface ProductCoverProps {
  logo: string | null;
  brandName: string;
  brandColor: string;
  /** Short text on the cover, such as the duration. */
  label?: string;
  size?: 'md' | 'lg';
}

/** Suppliers send no product photos, so every product gets a cover in its brand's color. */
export default function ProductCover({ logo, brandName, brandColor, label, size = 'md' }: ProductCoverProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl ${size === 'lg' ? 'h-48 sm:h-56' : 'h-32'}`}
      style={{ background: `linear-gradient(135deg, ${brandColor}26 0%, ${brandColor}0d 60%, transparent 100%), ${brandColor}12` }}
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: brandColor }}
        aria-hidden="true"
      />
      <ProductBrandIcon logo={logo} brandName={brandName} size="lg" className={size === 'lg' ? 'h-20 w-20 rounded-3xl p-3 shadow-md' : 'shadow-sm'} />
      {label && (
        <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-gray-900 shadow-sm dark:bg-gray-950/80 dark:text-white">
          {label}
        </span>
      )}
    </div>
  );
}
