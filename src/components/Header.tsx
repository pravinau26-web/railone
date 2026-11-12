import { Bell } from 'lucide-react';
import { UserProfile } from '../types';
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 pt-2.5 pb-2 shadow-2xs">
      <div className="flex items-center justify-between">
        {/* Language Switcher Circle */}
        <button
          type="button"
          onClick={() => alert('Language Switcher: English / தமிழ் / हिन्दी')}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/90 flex items-center justify-center p-1.5 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          title="Change Language"
        >
          <img
            src="/extracted_assets/lang_btn.png"
            alt="Language"
            className="w-7 h-7 object-contain"
            onError={(e) => {
              // Fallback text if image missing
              e.currentTarget.style.display = 'none';
            }}
          />
        </button>

        {/* Exact RailOne Logo */}
        <div className="flex items-center justify-center">
          <div className="flex items-center font-sans tracking-tight select-none">
            <span className="text-2xl font-light text-slate-800 tracking-normal">Ra</span>
            <span className="relative text-2xl font-light text-slate-800">
              ı
              <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#c2410c]"></span>
            </span>
            <span className="text-2xl font-light text-slate-800 mr-0.5">l</span>
            <span className="text-2xl font-extrabold text-[#1e293b]">One</span>
          </div>
        </div>

        {/* Notification Bell with Red Badge 15 */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 min-w-4.5 text-center leading-tight shadow-xs">
            15
          </span>
        </button>
      </div>

      {/* User Greeting and PWA Install Button */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-[#1e293b] tracking-tight cursor-pointer hover:text-blue-700" onClick={onOpenProfile}>
          Hi, <span className="font-bold">{userProfile.name}!</span>
        </p>
        <PWAInstallButton variant="header" />
      </div>
    </header>
  );
};
