import React from 'react';
import { getAssetUrl } from '../utils/assets';

interface RailOneLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const RailOneLogo: React.FC<RailOneLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const iconSizeClass =
    size === 'sm' ? 'w-6 h-6 rounded-lg' : size === 'lg' ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-[10px]';
  const textSizeClass =
    size === 'sm' ? 'text-[20px]' : size === 'lg' ? 'text-[28px]' : 'text-[24px]';
  const dotSizeClass =
    size === 'sm' ? 'w-[5px] h-[5px] -top-[2px]' : size === 'lg' ? 'w-[7px] h-[7px] -top-[2px]' : 'w-[6px] h-[6px] -top-[2px]';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className={`${iconSizeClass} overflow-hidden shrink-0 shadow-xs ring-1 ring-blue-600/20 bg-[#0c6aff]`}>
        <img
          src={getAssetUrl('assets/aistudio/railonelogo_72328bf0.jpg')}
          alt="RailOne App Logo"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {showWordmark && (
        <div className="flex items-baseline tracking-tight leading-none">
          <span className={`${textSizeClass} font-light text-[#1e293b] tracking-tight`}>Ra</span>
          <span className={`relative inline-flex flex-col items-center justify-center ${textSizeClass} font-light text-[#1e293b]`}>
            ı
            <span
              className={`absolute left-1/2 -translate-x-1/2 ${dotSizeClass} rounded-full bg-[#d94814]`}
              aria-hidden="true"
            />
          </span>
          <span className={`${textSizeClass} font-light text-[#1e293b] mr-[0.5px]`}>l</span>
          <span className={`${textSizeClass} font-extrabold text-[#0f172a] tracking-tight`}>One</span>
        </div>
      )}
    </div>
  );
};
