import React from 'react';
import { X, User, Wallet, EyeOff, HelpCircle, Headphones, Ticket, Info, ThumbsUp, Share2, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { RailOneLogo } from './RailOneLogo';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onAddMoney: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onAddMoney,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Brand & Close button */}
          <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
            <RailOneLogo size="sm" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-5 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-2">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">{userProfile.name}</h3>
          </div>

          {/* Wallet banner */}
          <div className="mx-4 p-3 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">R-Wallet</span>
                <span className="text-xs font-black text-slate-900">
                  ₹ {userProfile.walletBalance.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddMoney();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Add Money
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4 space-y-1">
            <button
              type="button"
              onClick={() => alert('Services display toggled.')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <EyeOff className="w-4 h-4 text-blue-600" />
              <span>Show/Hide Services</span>
            </button>

            <button
              type="button"
              onClick={() => alert('RailOne FAQs: UTS suburban booking is valid for 1 hour. PNR status updates every 5 minutes.')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>FAQs</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Railway Help & Support Helpline: 139')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-blue-600" />
              <span>Help & Support</span>
            </button>

            <button
              type="button"
              onClick={() => alert('PRS Counter Services: Physical ticket counters are open from 08:00 to 20:00 at all major stations.')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-blue-600" />
              <span>Reserved Services - Counter</span>
            </button>

            <button
              type="button"
              onClick={() => alert('RailOne App v2.1.79-253. Developed for Indian Railways modern digital passenger ticketing.')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span>About</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Thank you for rating RailOne 5 stars!')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4 text-blue-600" />
              <span>Rate Us</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Share RailOne App: https://railone.indianrail.gov.in')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={() => alert('Demo Session Active. You are logged in as Pravinkumar.')}
            className="w-full py-2 px-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
          <p className="text-[10px] text-slate-400 font-mono text-center">
            V-2.1.79-253
          </p>
        </div>
      </div>
    </div>
  );
};
