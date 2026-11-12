import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assets';

export type OfferingKey =
  | 'search_trains'
  | 'pnr_status'
  | 'coach_position'
  | 'track_train'
  | 'order_food'
  | 'file_refund'
  | 'rail_madad'
  | 'goto_waves';

interface OfferingIconProps {
  type: OfferingKey;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BG_COLORS: Record<OfferingKey, string> = {
  search_trains: 'bg-[#fce7f3]',
  pnr_status: 'bg-[#dcfce7]',
  coach_position: 'bg-[#e0f2fe]',
  track_train: 'bg-[#fef3c7]',
  order_food: 'bg-[#ede9fe]',
  file_refund: 'bg-[#f5f5f4]',
  rail_madad: 'bg-[#ffe4e6]',
  goto_waves: 'bg-[#1e293b]',
};

export const OfferingIcon: React.FC<OfferingIconProps> = ({
  type,
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  const containerSize =
    size === 'sm' ? 'w-11 h-11' : size === 'lg' ? 'w-16 h-16' : 'w-[52px] h-[52px]';

  return (
    <div
      className={`relative ${containerSize} rounded-2xl ${BG_COLORS[type]} flex items-center justify-center overflow-hidden shadow-2xs group-hover:shadow-xs group-hover:scale-105 transition-all select-none ${className}`}
    >
      {!imageError ? (
        <img
          src={getAssetUrl(`extracted_assets/offerings/${type}.png`)}
          alt={type}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Vector SVG Fallback with exact RailOne geometry */
        <div className="w-full h-full flex items-center justify-center p-2.5">
          {type === 'search_trains' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#c026d3]">
              <circle cx="28" cy="62" r="14" fill="currentColor" />
              <circle cx="28" cy="62" r="6" fill="#fce7f3" />
              <path
                d="M28 62 H62 C74 62 74 38 62 38 H48 C36 38 36 20 48 20 H68"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="68" cy="20" r="14" fill="currentColor" />
              <circle cx="68" cy="20" r="6" fill="#fce7f3" />
            </svg>
          )}

          {type === 'pnr_status' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#15803d]">
              <path
                d="M15 28 C15 24 18 20 22 20 H78 C82 20 85 24 85 28 V40 C80 42 78 46 78 50 C78 54 80 58 85 60 V72 C85 76 82 80 78 80 H22 C18 80 15 76 15 72 V60 C20 58 22 54 22 50 C22 46 20 42 15 40 Z"
                fill="currentColor"
              />
              <line
                x1="34"
                y1="26"
                x2="34"
                y2="74"
                stroke="#dcfce7"
                strokeWidth="3.5"
                strokeDasharray="5 4"
              />
              <rect x="44" y="34" width="28" height="5" rx="2.5" fill="#dcfce7" />
              <rect x="44" y="47" width="28" height="5" rx="2.5" fill="#dcfce7" />
              <rect x="44" y="60" width="28" height="5" rx="2.5" fill="#dcfce7" />
            </svg>
          )}

          {type === 'coach_position' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#0369a1]">
              <path
                d="M22 68 H86 L78 38 C75 31 68 28 60 28 H30 C24 28 20 33 20 40 Z"
                fill="currentColor"
              />
              <rect x="28" y="36" width="12" height="12" rx="3" fill="#e0f2fe" />
              <rect x="44" y="36" width="10" height="12" rx="2" fill="#e0f2fe" />
              <rect x="58" y="36" width="10" height="12" rx="2" fill="#e0f2fe" />
              <rect x="16" y="72" width="72" height="4.5" rx="2" fill="currentColor" />
            </svg>
          )}

          {type === 'track_train' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#d97706]">
              <rect x="25" y="20" width="50" height="54" rx="14" fill="currentColor" />
              <rect x="31" y="26" width="38" height="22" rx="4" fill="#fef3c7" />
              <circle cx="36" cy="60" r="4.5" fill="#fef3c7" />
              <circle cx="64" cy="60" r="4.5" fill="#fef3c7" />
              <line
                x1="28"
                y1="84"
                x2="38"
                y2="74"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <line
                x1="72"
                y1="84"
                x2="62"
                y2="74"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <line
                x1="20"
                y1="84"
                x2="80"
                y2="84"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          )}

          {type === 'order_food' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#312e81]">
              <path d="M18 46 C18 32 30 24 46 24 C52 24 57 26 62 30 V46 Z" fill="currentColor" />
              <rect x="18" y="50" width="44" height="6" rx="3" fill="currentColor" />
              <rect x="18" y="60" width="44" height="8" rx="4" fill="currentColor" />
              <path d="M54 34 L60 76 H76 L82 34 Z" fill="currentColor" />
              <rect x="52" y="30" width="32" height="5" rx="2" fill="currentColor" />
              <line
                x1="68"
                y1="30"
                x2="72"
                y2="16"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          )}

          {type === 'file_refund' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#374151]">
              <path
                d="M18 28 C18 24 22 20 26 20 H74 C78 20 82 24 82 28 V40 C78 42 76 46 76 50 C76 54 78 58 82 60 V72 C82 76 78 80 74 80 H26 C22 80 18 76 18 72 V60 C22 58 24 54 24 50 C24 46 22 42 18 40 Z"
                fill="currentColor"
              />
              <circle cx="64" cy="36" r="13" fill="#f5f5f4" stroke="currentColor" strokeWidth="3.5" />
              <line
                x1="58"
                y1="30"
                x2="70"
                y2="42"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="70"
                y1="30"
                x2="58"
                y2="42"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          )}

          {type === 'rail_madad' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-[#e11d48]">
              <path
                d="M38 24 L22 40 C19 43 19 48 22 51 L44 73 C47 76 52 76 55 73 L74 54 C77 51 77 46 74 43 L58 27 C54 23 48 23 44 27 L38 24 Z"
                fill="currentColor"
              />
              <line
                x1="38"
                y1="46"
                x2="52"
                y2="60"
                stroke="#ffe4e6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="44"
                y1="40"
                x2="58"
                y2="54"
                stroke="#ffe4e6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="50"
                y1="34"
                x2="64"
                y2="48"
                stroke="#ffe4e6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          )}

          {type === 'goto_waves' && (
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-white">
              <path d="M48 12 L52 12 L56 68 H44 Z" fill="currentColor" />
              <path d="M30 36 L40 68 H26 L22 46 Z" fill="currentColor" />
              <path d="M70 36 L60 68 H74 L78 46 Z" fill="currentColor" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};
