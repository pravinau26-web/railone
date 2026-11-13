import React from 'react';
import { Bell } from 'lucide-react';
import { UserProfile } from '../types';
import { RailOneLogo } from './RailOneLogo';
import { PWAInstallButton } from './PWAInstallButton';

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
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-2.5 pb-2 shadow-2xs">
      <div className="flex items-center justify-between">
        {/* Clean Vector Language Switcher Circle (A/अ with circular arrows) */}
        <button
          type="button"
          onClick={() => alert('Language Switcher: English / தமிழ் / हिन्दी')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          title="Change Language"
          aria-label="Change Language"
        >
          <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Curved swap arrows */}
            <path
              d="M21 7.5C24.5 8.3 27.2 11 28 14.5"
              stroke="#1251b5"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d="M28.8 11.8L28.1 15L25.1 13.7"
              stroke="#1251b5"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 28.5C11.5 27.7 8.8 25 8 21.5"
              stroke="#1251b5"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d="M7.2 24.2L7.9 21L10.9 22.3"
              stroke="#1251b5"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Letter A */}
            <text
              x="8.5"
              y="18.5"
              fill="#0b46a3"
              fontSize="12.5"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              A
            </text>
            {/* Letter अ */}
            <text
              x="17.5"
              y="26.5"
              fill="#0b46a3"
              fontSize="13.5"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              अ
            </text>
          </svg>
        </button>

        {/* Official RailOne Logo */}
        <div className="flex items-center justify-center py-0.5">
          <RailOneLogo size="md" />
        </div>

        {/* Notification Bell with Badge */}
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
