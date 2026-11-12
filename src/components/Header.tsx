import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { UserProfile } from '../types';
import { RailOneLogo } from './RailOneLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { getAssetUrl } from '../utils/assets';

interface HeaderProps {
  userProfile: UserProfile;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const [langImgError, setLangImgError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 pt-2.5 pb-2 shadow-2xs">
      <div className="flex items-center justify-between">
        {/* Language Switcher Circle (A/अ with circular arrows) */}
        <button
          type="button"
          onClick={() => alert('Language Switcher: English / தமிழ் / हिन्दी')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/90 flex items-center justify-center p-1.5 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          title="Change Language"
        >
          {!langImgError ? (
            <img
              src={getAssetUrl('extracted_assets/lang_btn_clean.png')}
              alt="Language"
              className="w-7 h-7 object-contain"
              onError={() => setLangImgError(true)}
            />
          ) : (
            <div className="relative w-6 h-6 flex items-center justify-center text-blue-600 font-bold select-none text-[11px] leading-none">
              <span className="absolute -top-0.5 left-0.5 text-blue-700">A</span>
              <span className="absolute -bottom-0.5 right-0.5 text-blue-800 text-[10px]">अ</span>
              <span className="text-[10px] text-slate-300">/</span>
            </div>
          )}
        </button>

        {/* Exact Authentic RailOne Logo */}
        <div className="flex items-center justify-center py-0.5">
          <RailOneLogo size="md" />
        </div>

        {/* Notification Bell with Authentic Red Badge 15 */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8] text-slate-700" />
          <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 min-w-4.5 text-center leading-tight shadow-xs">
            15
          </span>
        </button>
      </div>

      {/* User Greeting and PWA Install Button */}
      <div className="mt-2.5 flex items-center justify-between">
        <p
          className="text-xs font-semibold text-[#152744] tracking-tight cursor-pointer hover:text-blue-700 transition-colors"
          onClick={onOpenProfile}
        >
          Hi, <span className="font-bold">{userProfile.name}!</span>
        </p>
        <PWAInstallButton variant="header" />
      </div>
    </header>
  );
};
