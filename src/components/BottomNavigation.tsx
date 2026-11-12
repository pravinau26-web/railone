import React from 'react';
import { Home, Ticket, User, Menu as MenuIcon } from 'lucide-react';

export type TabType = 'home' | 'bookings' | 'you' | 'menu';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bookingCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  bookingCount = 1,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg max-w-md mx-auto">
      <div className="grid grid-cols-4 items-center">
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('bookings')}
          className={`relative flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <Ticket className={`w-5 h-5 mb-0.5 ${activeTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-tight">My Bookings</span>
          {bookingCount > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('you')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            activeTab === 'you'
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'you' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-tight">You</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('menu')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <MenuIcon className={`w-5 h-5 mb-0.5 ${activeTab === 'menu' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
};
