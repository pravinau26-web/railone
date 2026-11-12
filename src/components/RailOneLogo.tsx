import React from 'react';
import { getAssetUrl } from '../utils/assets';

interface RailOneLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RailOneLogo: React.FC<RailOneLogoProps> = ({ className = '', size = 'md' }) => {
  const [imageError, setImageError] = React.useState(false);

  // Height mappings
  const heightClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';

  return (
    <div className={`flex items-center select-none ${className}`}>
      {!imageError ? (
        <img
          src={getAssetUrl('extracted_assets/railone_logo_exact.png')}
          alt="RailOne Logo"
          className={`${heightClass} w-auto object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        /* Pixel-perfect vector recreation matching authentic RailOne branding */
        <div className="flex items-center tracking-tight leading-none">
          <span className="text-[26px] font-normal text-[#2b3545] tracking-tight">Ra</span>
          <span className="relative inline-flex flex-col items-center justify-center text-[26px] font-normal text-[#2b3545]">
            ı
            <span
              className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#d84315] shadow-xs"
              style={{ backgroundColor: '#e04a1a' }}
            />
          </span>
          <span className="text-[26px] font-normal text-[#2b3545] mr-[1px]">l</span>
          <span className="text-[26px] font-black text-[#0f172a] tracking-tight ml-[1px]">One</span>
        </div>
      )}
    </div>
  );
};
